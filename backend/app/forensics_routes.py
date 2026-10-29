from __future__ import annotations

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.forensics import create_explainability_status, inspect_image, run_quality_checks

router = APIRouter(prefix='/api/v1', tags=['forensics'])


@router.post('/forensics/inspect')
async def inspect_forensics(file: UploadFile = File(...)) -> dict:
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail='Uploaded file is empty.')

    try:
        forensics = inspect_image(contents, file.filename or 'upload')
        quality_tests = run_quality_checks(contents)
        return {
            'image': forensics,
            'quality_tests': quality_tests,
            'explainability': create_explainability_status(),
            'notes': [
                'Metadata absence is not evidence of AI generation.',
                'Compression and resizing tests are robustness checks, not definitive authenticity proofs.',
                'A saliency visualization is only meaningful when the selected model exposes a validated explanation method.',
            ],
        }
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc
