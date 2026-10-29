from __future__ import annotations

from types import SimpleNamespace

import pytest
import torch

from app.services.model_service import (
    ImageTooLargeError,
    InvalidImageError,
    ModelInferenceError,
    ModelService,
)


@pytest.fixture
def dummy_service() -> ModelService:
    return ModelService(model_id='demo/model', cache_dir='/tmp/veritas-tests')


def test_preprocessing_rejects_invalid_image(dummy_service: ModelService) -> None:
    with pytest.raises(InvalidImageError):
        dummy_service._validate_upload(None, b'not-an-image')


def test_preprocessing_rejects_oversized_image(dummy_service: ModelService) -> None:
    with pytest.raises(ImageTooLargeError):
        dummy_service._validate_upload(None, b'a' * (11 * 1024 * 1024 + 1))


def test_label_mapping_uses_model_labels() -> None:
    service = ModelService(model_id='demo/model', cache_dir='/tmp/veritas-tests')
    assert service._map_label('human') == 'authentic'
    assert service._map_label('AI-generated') == 'ai_generated'
    assert service._map_label('unknown') == 'inconclusive'


def test_predict_result_validation(dummy_service: ModelService) -> None:
    logits = torch.tensor([0.2, 0.8])
    result = dummy_service._safe_softmax(logits)
    assert result.shape == (2,)
    assert float(result[1].item()) > 0.5


def test_calibrated_confidence_avoids_false_low_scores() -> None:
    service = ModelService(model_id='demo/model', cache_dir='/tmp/veritas-tests')
    moderate_score = service._calibrate_confidence(0.52)
    low_score = service._calibrate_confidence(0.12)

    assert moderate_score > 0.52
    assert low_score < 0.4


def test_model_inference_failure_is_wrapped(monkeypatch: pytest.MonkeyPatch) -> None:
    service = ModelService(model_id='demo/model', cache_dir='/tmp/veritas-tests')

    def broken_load(*args, **kwargs):
        raise RuntimeError('download failed')

    monkeypatch.setattr('app.services.model_service.AutoImageProcessor.from_pretrained', broken_load)
    monkeypatch.setattr('app.services.model_service.AutoModelForImageClassification.from_pretrained', broken_load)

    with pytest.raises(ModelInferenceError):
        service.load()
