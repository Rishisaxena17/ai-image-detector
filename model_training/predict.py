from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import torch
from PIL import Image, ImageOps
from transformers import AutoProcessor, CLIPModel


@torch.inference_mode()
def main() -> None:
    parser = argparse.ArgumentParser(description='Predict whether an image is AI-generated.')
    parser.add_argument('image', type=Path)
    parser.add_argument('--artifacts', type=Path, default=Path(__file__).resolve().parent / 'artifacts')
    args = parser.parse_args()

    config = json.loads((args.artifacts / 'config.json').read_text())
    classifier = joblib.load(args.artifacts / 'classifier.joblib')
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    processor = AutoProcessor.from_pretrained(config['model_id'])
    encoder = CLIPModel.from_pretrained(config['model_id']).to(device)
    encoder.eval()

    with Image.open(args.image) as image:
        image = ImageOps.exif_transpose(image).convert('RGB')
    inputs = processor(images=image, return_tensors='pt')
    features = encoder.get_image_features(pixel_values=inputs['pixel_values'].to(device))
    features = torch.nn.functional.normalize(features, dim=-1).cpu().numpy()
    score = float(classifier.predict_proba(features)[0, 1])
    threshold = float(config['threshold'])
    print(json.dumps({
        'prediction': 'ai_generated' if score >= threshold else 'authentic',
        'ai_score': score,
        'threshold': threshold,
        'warning': 'This score is not a verified probability of authenticity.',
    }, indent=2))


if __name__ == '__main__':
    main()
