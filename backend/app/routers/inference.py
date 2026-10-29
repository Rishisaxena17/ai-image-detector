from __future__ import annotations

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.services.model_service import (
    ImageTooLargeError,
    InvalidImageError,
    ModelInferenceError,
    ModelService,
    get_model_service as get_shared_model_service,
    UnsupportedFormatError,
)

router = APIRouter(tags=['inference'])
def get_model_service() -> ModelService:
    return get_shared_model_service()


@router.post('/infer')
async def infer_image(file: UploadFile = File(...)) -> dict:
    service = get_model_service()

    try:
        result = await service.predict_uploaded_file(file)
        return {
            'success': True,
            'data': result,
            'message': 'Inference completed.',
        }
    except UnsupportedFormatError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except InvalidImageError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc
    except ImageTooLargeError as exc:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail=str(exc)) from exc
    except ModelInferenceError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc


@router.get('/model-status')
def model_status() -> dict:
    return get_model_service().status()


@router.get('/health')
def health() -> dict:
    return {
        'status': 'ok',
        'service': 'veritas-ai-inference',
        'model_ready': get_model_service().is_ready,
    }
