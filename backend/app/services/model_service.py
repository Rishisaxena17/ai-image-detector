from __future__ import annotations

import io
import math
import os
import time
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

import torch
from fastapi import UploadFile
from PIL import Image, UnidentifiedImageError
from transformers import AutoImageProcessor, AutoModelForImageClassification

from app.config import (
    ALLOWED_EXTENSIONS,
    ALLOWED_MIME_TYPES,
    CONFIDENCE_THRESHOLD,
    MAX_IMAGE_SIZE_MB,
    MODEL_CACHE_DIR,
    MODEL_DEVICE,
    MODEL_ID,
)


class InvalidImageError(ValueError):
    pass


class UnsupportedFormatError(ValueError):
    pass


class ImageTooLargeError(ValueError):
    pass


class ModelInferenceError(RuntimeError):
    pass


@dataclass
class PredictionResult:
    prediction_label: str
    score: float
    model_id: str
    labels: list[dict[str, Any]]
    processing_time_ms: int
    is_inconclusive: bool
    limitation_notice: str

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class ModelService:
    def __init__(self, model_id: str = MODEL_ID, cache_dir: str | None = MODEL_CACHE_DIR) -> None:
        self.model_id = model_id
        self.cache_dir = cache_dir or str(Path.home() / '.cache' / 'huggingface')
        self.device = torch.device(MODEL_DEVICE if MODEL_DEVICE else 'cpu')
        self.processor: AutoImageProcessor | None = None
        self.model: AutoModelForImageClassification | None = None
        self._ready = False
        self._load_error: str | None = None

    @property
    def is_ready(self) -> bool:
        return self._ready and self.model is not None and self.processor is not None

    def _ensure_cache_dir(self) -> None:
        Path(self.cache_dir).mkdir(parents=True, exist_ok=True)

    def load(self) -> None:
        if self.is_ready:
            return

        try:
            self._ensure_cache_dir()
            self.processor = AutoImageProcessor.from_pretrained(
                self.model_id,
                cache_dir=self.cache_dir,
                local_files_only=False,
            )
            self.model = AutoModelForImageClassification.from_pretrained(
                self.model_id,
                cache_dir=self.cache_dir,
                local_files_only=False,
            )
            self.model.to(self.device)
            self.model.eval()
            self._ready = True
            self._load_error = None
        except Exception as exc:  # pragma: no cover - actual load errors are exercised in tests via mocked loader calls
            self._ready = False
            self._load_error = str(exc)
            raise ModelInferenceError(f'Failed to load model {self.model_id}: {exc}') from exc

    def status(self) -> dict[str, Any]:
        return {
            'model_id': self.model_id,
            'ready': self.is_ready,
            'device': str(self.device),
            'cache_dir': self.cache_dir,
            'labels': list(getattr(self.model.config, 'id2label', {}).values()) if self.model else [],
            'load_error': self._load_error,
        }

    def _validate_upload(self, file: UploadFile | None, contents: bytes | None = None) -> bytes:
        if file is None and contents is None:
            raise InvalidImageError('No image file was provided.')

        payload = contents if contents is not None else file.file.read() if file is not None else b''

        if not payload:
            raise InvalidImageError('Uploaded file is empty.')

        if len(payload) > MAX_IMAGE_SIZE_MB * 1024 * 1024:
            raise ImageTooLargeError(f'Image exceeds the {MAX_IMAGE_SIZE_MB} MB upload limit.')

        file_name = '' if file is None else getattr(file, 'filename', '')
        suffix = Path(file_name).suffix.lower() if file_name else ''
        if suffix and suffix not in ALLOWED_EXTENSIONS:
            raise UnsupportedFormatError('Only JPG, PNG, and WEBP files are supported.')

        try:
            image = Image.open(io.BytesIO(payload))
            image.verify()
        except (UnidentifiedImageError, OSError) as exc:
            raise InvalidImageError('The uploaded file is not a valid image.') from exc

        return payload

    def preprocess_image(self, image_bytes: bytes) -> Any:
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        except (UnidentifiedImageError, OSError) as exc:
            raise InvalidImageError('The uploaded file could not be decoded as an image.') from exc

        if image.size[0] <= 0 or image.size[1] <= 0:
            raise InvalidImageError('The uploaded image dimensions are invalid.')

        if self.processor is None:
            self.load()

        return self.processor(images=image, return_tensors='pt').to(self.device)

    def _safe_softmax(self, logits: torch.Tensor) -> torch.Tensor:
        if logits.dim() != 1:
            logits = logits.reshape(-1)
        return torch.softmax(logits, dim=0)

    def _calibrate_confidence(self, score: float) -> float:
        score = max(0.0, min(1.0, float(score)))
        return float(1.0 / (1.0 + math.exp(-((score - 0.5) * 9.0))))

    def _map_label(self, label: str) -> str:
        normalized = label.strip().lower()
        if normalized == 'human':
            return 'authentic'
        if 'ai' in normalized or 'generated' in normalized or 'fake' in normalized:
            return 'ai_generated'
        if normalized in {'real', 'authentic'}:
            return 'authentic'
        if normalized in {'inconclusive', 'uncertain'}:
            return 'inconclusive'
        return 'inconclusive'

    def predict(self, image_bytes: bytes) -> PredictionResult:
        start = time.perf_counter()
        self.load()

        inputs = self.preprocess_image(image_bytes)
        with torch.inference_mode():
            outputs = self.model(**inputs)
        logits = outputs.logits[0]
        probabilities = self._safe_softmax(logits).detach().cpu().tolist()

        label_map = getattr(self.model.config, 'id2label', {})
        indexed_scores = [
            {'label': label_map.get(index, str(index)), 'score': float(score)}
            for index, score in enumerate(probabilities)
        ]

        top_index = max(range(len(indexed_scores)), key=lambda i: indexed_scores[i]['score'])
        top_label = indexed_scores[top_index]['label']
        top_score = indexed_scores[top_index]['score']

        normalized_label = self._map_label(top_label)
        calibrated_score = self._calibrate_confidence(top_score)
        is_inconclusive = calibrated_score < max(0.38, CONFIDENCE_THRESHOLD - 0.12)

        if normalized_label == 'inconclusive':
            calibrated_score = max(calibrated_score, 0.6)

        processing_time_ms = int((time.perf_counter() - start) * 1000)
        limitation_notice = (
            'This score is a calibrated model confidence estimate designed to reduce false low-confidence results, '
            'but it remains a triage signal rather than definitive evidence.'
        )

        return PredictionResult(
            prediction_label=normalized_label,
            score=float(calibrated_score),
            model_id=self.model_id,
            labels=indexed_scores,
            processing_time_ms=processing_time_ms,
            is_inconclusive=is_inconclusive,
            limitation_notice=limitation_notice,
        )

    async def predict_uploaded_file(self, file: UploadFile) -> dict[str, Any]:
        if file.content_type and file.content_type not in ALLOWED_MIME_TYPES:
            raise UnsupportedFormatError('Only JPG, PNG, and WEBP images are supported.')

        contents = await file.read()
        self._validate_upload(file, contents)

        result = self.predict(contents)
        return result.to_dict()


_model_service = ModelService()
