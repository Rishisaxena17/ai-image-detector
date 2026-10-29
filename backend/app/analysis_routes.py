from __future__ import annotations

import hashlib
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, Query, Response, UploadFile, status
from PIL import Image, UnidentifiedImageError
from sqlalchemy.orm import Session

from app.config import ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, MAX_IMAGE_DIMENSION, MAX_IMAGE_SIZE_MB, RETENTION_DAYS, UPLOAD_DIR
from app.database import get_db
from app.models import Analysis, User
from app.schemas import AnalysisListResponse, AnalysisOut
from app.security import get_optional_current_user
from app.services.model_service import ModelInferenceError, ModelService

router = APIRouter(prefix='/api/v1', tags=['analysis'])


def _ensure_upload_dir() -> Path:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    return UPLOAD_DIR


def _parse_image_metadata(file_bytes: bytes) -> tuple[int, int, str, str]:
    try:
        image = Image.open(__import__('io').BytesIO(file_bytes))
        width, height = image.size
        image.verify()
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail='Uploaded file is not a valid image.') from exc

    if width <= 0 or height <= 0:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail='Image dimensions are invalid.')
    if max(width, height) > MAX_IMAGE_DIMENSION:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail=f'Image resolution exceeds the {MAX_IMAGE_DIMENSION}px limit.')

    content_type = 'image/jpeg' if file_bytes[:2] == b'\xff\xd8' else 'image/png' if file_bytes[:8] == b'\x89PNG\r\n\x1a\n' else 'image/webp' if file_bytes[:4] == b'RIFF' else 'application/octet-stream'
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Only JPG, PNG, and WEBP images are supported.')

    return width, height, content_type, image.format or content_type.split('/')[-1].upper()


@router.post('/analyze', response_model=AnalysisOut)
async def analyze_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_current_user),
) -> AnalysisOut:
    if file.content_type and file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Only JPG, PNG, and WEBP images are supported.')

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail='Uploaded file is empty.')
    if len(contents) > MAX_IMAGE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail=f'Image exceeds the {MAX_IMAGE_SIZE_MB} MB upload limit.')

    try:
        import io
        image = Image.open(io.BytesIO(contents))
        image.verify()
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail='The uploaded file is not a valid image.') from exc

    width, height, content_type, extension = _parse_image_metadata(contents)
    safe_name = Path(file.filename or 'upload').name
    suffix = Path(safe_name).suffix.lower()
    if suffix and suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Only JPG, PNG, and WEBP files are supported.')

    if '..' in safe_name or '/' in safe_name or '\\' in safe_name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid file name.')

    model = ModelService()
    try:
        prediction = model.predict(contents)
    except (ModelInferenceError, RuntimeError, ValueError) as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc

    uploads_dir = _ensure_upload_dir()
    file_id = f'{datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S%f")}_{current_user.id}'
    storage_path = uploads_dir / f'{file_id}{suffix or ".png"}'
    storage_path.write_bytes(contents)
    file_fingerprint = hashlib.sha256(contents).hexdigest()

    analysis = Analysis(
        owner_id=current_user.id,
        prediction=prediction.prediction_label,
        score=float(prediction.score),
        model_id=prediction.model_id,
        model_version=prediction.model_id,
        processing_time_ms=int(prediction.processing_time_ms),
        is_inconclusive=bool(prediction.is_inconclusive),
        limitation_notice=prediction.limitation_notice,
        file_name=safe_name,
        content_type=content_type,
        file_size_bytes=len(contents),
        file_fingerprint=file_fingerprint,
        image_width=width,
        image_height=height,
        storage_path=str(storage_path),
        retention_policy=f'Delete after {RETENTION_DAYS} days or on user deletion',
        labels=prediction.labels,
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return AnalysisOut.model_validate(analysis)


@router.get('/analyses', response_model=AnalysisListResponse)
def list_analyses(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
) -> AnalysisListResponse:
    query = db.query(Analysis).filter(Analysis.owner_id == current_user.id).order_by(Analysis.created_at.desc())
    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return AnalysisListResponse(
        items=[AnalysisOut.model_validate(item) for item in items],
        page=page,
        page_size=page_size,
        total=total,
    )


@router.get('/analyses/{analysis_id}', response_model=AnalysisOut)
def get_analysis(
    analysis_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_current_user),
) -> AnalysisOut:
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.owner_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Analysis not found.')
    return AnalysisOut.model_validate(analysis)


@router.delete('/analyses/{analysis_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_analysis(
    analysis_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_current_user),
) -> Response:
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.owner_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Analysis not found.')

    if Path(analysis.storage_path).exists():
        try:
            Path(analysis.storage_path).unlink()
        except OSError:
            pass

    db.delete(analysis)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get('/health')
def health() -> dict:
    return {'status': 'ok', 'service': 'veritas-ai-backend', 'model_ready': ModelService().is_ready}


@router.get('/model/status')
def model_status() -> dict:
    service = ModelService()
    return service.status()
