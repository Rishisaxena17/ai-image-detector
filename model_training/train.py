from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable

import joblib
import numpy as np
import torch
from PIL import Image, ImageOps
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from transformers import AutoProcessor, CLIPModel

ROOT = Path(__file__).resolve().parent
DEFAULT_DATASET = ROOT / 'dataset'
DEFAULT_OUTPUT = ROOT / 'artifacts'
DEFAULT_MODEL_ID = 'openai/clip-vit-large-patch14'


def image_paths(data_dir: Path, split: str) -> Iterable[tuple[Path, int]]:
    for folder, label in (('real', 0), ('ai', 1)):
        class_dir = data_dir / split / folder
        if not class_dir.is_dir():
            raise FileNotFoundError(f'Missing dataset directory: {class_dir}')
        for path in sorted(class_dir.iterdir()):
            if path.is_file() and path.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp'}:
                yield path, label


def load_images(data_dir: Path, split: str) -> tuple[list[Image.Image], np.ndarray]:
    images: list[Image.Image] = []
    labels: list[int] = []
    for path, label in image_paths(data_dir, split):
        try:
            with Image.open(path) as image:
                images.append(ImageOps.exif_transpose(image).convert('RGB'))
            labels.append(label)
        except (OSError, ValueError) as exc:
            raise ValueError(f'Could not read {path}: {exc}') from exc
    if not images:
        raise ValueError(f'No supported images found in {data_dir / split}')
    return images, np.asarray(labels, dtype=np.int64)


@torch.inference_mode()
def extract_features(
    processor: AutoProcessor,
    encoder: CLIPModel,
    images: list[Image.Image],
    device: torch.device,
    batch_size: int,
) -> np.ndarray:
    batches: list[np.ndarray] = []
    for start in range(0, len(images), batch_size):
        inputs = processor(images=images[start:start + batch_size], return_tensors='pt')
        pixels = inputs['pixel_values'].to(device)
        features = encoder.get_image_features(pixel_values=pixels)
        features = torch.nn.functional.normalize(features, dim=-1)
        batches.append(features.cpu().numpy())
    return np.concatenate(batches, axis=0)


def select_threshold(scores: np.ndarray, labels: np.ndarray) -> float:
    candidates = np.linspace(0.05, 0.95, 181)
    best_threshold = 0.5
    best_f1 = -1.0
    for threshold in candidates:
        predicted = (scores >= threshold).astype(np.int64)
        score = f1_score(labels, predicted, zero_division=0)
        if score > best_f1:
            best_f1 = score
            best_threshold = float(threshold)
    return best_threshold


def evaluate(scores: np.ndarray, labels: np.ndarray, threshold: float) -> dict[str, object]:
    predicted = (scores >= threshold).astype(np.int64)
    metrics: dict[str, object] = {
        'threshold': threshold,
        'accuracy': float(accuracy_score(labels, predicted)),
        'precision': float(precision_score(labels, predicted, zero_division=0)),
        'recall': float(recall_score(labels, predicted, zero_division=0)),
        'f1': float(f1_score(labels, predicted, zero_division=0)),
        'confusion_matrix': confusion_matrix(labels, predicted).tolist(),
        'classification_report': classification_report(
            labels,
            predicted,
            target_names=['real', 'ai'],
            zero_division=0,
            output_dict=True,
        ),
    }
    if len(np.unique(labels)) == 2:
        metrics['roc_auc'] = float(roc_auc_score(labels, scores))
    return metrics


def main() -> None:
    parser = argparse.ArgumentParser(description='Train a CLIP-feature AI-image detector.')
    parser.add_argument('--dataset', type=Path, default=DEFAULT_DATASET)
    parser.add_argument('--output', type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument('--model-id', default=DEFAULT_MODEL_ID)
    parser.add_argument('--batch-size', type=int, default=8)
    args = parser.parse_args()
    if args.batch_size < 1:
        raise ValueError('--batch-size must be positive')

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f'Device: {device}')
    print(f'Encoder: {args.model_id}')
    processor = AutoProcessor.from_pretrained(args.model_id)
    encoder = CLIPModel.from_pretrained(args.model_id).to(device)
    encoder.eval()

    train_images, train_labels = load_images(args.dataset, 'train')
    val_images, val_labels = load_images(args.dataset, 'val')
    test_images, test_labels = load_images(args.dataset, 'test')
    train_features = extract_features(processor, encoder, train_images, device, args.batch_size)
    val_features = extract_features(processor, encoder, val_images, device, args.batch_size)
    test_features = extract_features(processor, encoder, test_images, device, args.batch_size)

    classifier = LogisticRegression(max_iter=2000, class_weight='balanced', random_state=42)
    classifier.fit(train_features, train_labels)
    val_scores = classifier.predict_proba(val_features)[:, 1]
    threshold = select_threshold(val_scores, val_labels)
    test_scores = classifier.predict_proba(test_features)[:, 1]

    args.output.mkdir(parents=True, exist_ok=True)
    joblib.dump(classifier, args.output / 'classifier.joblib')
    config = {
        'model_id': args.model_id,
        'threshold': threshold,
        'positive_label': 'ai_generated',
        'negative_label': 'authentic',
        'feature_normalization': 'l2',
        'encoder_type': 'clip_image_features',
        'metrics': {
            'validation': evaluate(val_scores, val_labels, threshold),
            'test': evaluate(test_scores, test_labels, threshold),
        },
    }
    (args.output / 'config.json').write_text(json.dumps(config, indent=2) + '\n')
    print(json.dumps(config['metrics'], indent=2))


if __name__ == '__main__':
    main()
