from __future__ import annotations

import hashlib
import io
import statistics
from typing import Any

from PIL import Image, ImageOps, UnidentifiedImageError

SAFE_EXIF_KEYS = {
    'Artist', 'Author', 'CameraOwnerName', 'Copyright', 'DateTime', 'DateTimeOriginal',
    'ExifVersion', 'Flash', 'GPSInfo', 'ImageDescription', 'LensModel', 'Make', 'Model',
    'Software', 'XPTitle', 'XPAuthor', 'XPKeywords', 'XPSubject'
}


def _safe_exif(image: Image.Image) -> dict[str, Any]:
    try:
        exif = image.getexif()
    except Exception:
        return {}

    if not exif:
        return {}

    safe: dict[str, Any] = {}
    for key, value in exif.items():
        if not isinstance(key, int):
            continue
        label = Image.ExifTags.TAGS.get(key, str(key))
        if label not in SAFE_EXIF_KEYS:
            continue
        if isinstance(value, bytes):
            try:
                value = value.decode('utf-8', errors='replace')
            except Exception:
                value = str(value)
        safe[label] = str(value)
    return safe


def hash_file_sha256(file_bytes: bytes) -> str:
    return hashlib.sha256(file_bytes).hexdigest()


def inspect_image(image_bytes: bytes, file_name: str = 'upload') -> dict[str, Any]:
    try:
        image = Image.open(io.BytesIO(image_bytes))
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise ValueError('The uploaded file is not a valid image.') from exc

    image.load()
    metadata = _safe_exif(image)
    return {
        'file_name': file_name,
        'format': (image.format or 'unknown').upper(),
        'mode': image.mode,
        'width': image.width,
        'height': image.height,
        'file_size_bytes': len(image_bytes),
        'sha256': hash_file_sha256(image_bytes),
        'metadata': metadata,
        'metadata_present': bool(metadata),
        'metadata_note': 'Metadata absence is not evidence of authenticity or AI generation; it is only an absence of embedded metadata.',
    }


def _compare_images(image: Image.Image, transformed: Image.Image) -> float:
    original = image.convert('L')
    changed = transformed.convert('L')
    if original.size != changed.size:
        changed = changed.resize(original.size)
    original_pixels = list(original.getdata())
    changed_pixels = list(changed.getdata())
    if not original_pixels or not changed_pixels:
        return 0.0
    diffs = [abs(a - b) for a, b in zip(original_pixels, changed_pixels)]
    return round(statistics.mean(diffs) / 255.0, 4)


def run_quality_checks(image_bytes: bytes) -> list[dict[str, Any]]:
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise ValueError('The uploaded file is not a valid image.') from exc

    original = image.copy()
    resized = image.resize((max(1, image.width // 2), max(1, image.height // 2)))
    jpeg_bytes = io.BytesIO()
    image.save(jpeg_bytes, format='JPEG', quality=70)
    jpeg_loaded = Image.open(io.BytesIO(jpeg_bytes.getvalue())).convert('RGB')
    altered = ImageOps.autocontrast(image)
    altered = ImageOps.posterize(altered, 4)

    checks = [
        {
            'name': 'resized_copy',
            'description': 'Downscaled test copy to check robustness to resolution changes.',
            'difference_score': _compare_images(original, resized),
        },
        {
            'name': 'jpeg_compressed_copy',
            'description': 'JPEG recompression at quality 70 to evaluate compression sensitivity.',
            'difference_score': _compare_images(original, jpeg_loaded),
        },
        {
            'name': 'mild_alteration_copy',
            'description': 'Mild post-processing alteration to assess whether small edits materially shift the signal.',
            'difference_score': _compare_images(original, altered),
        },
    ]
    return checks


def create_explainability_status() -> dict[str, Any]:
    return {
        'supported': False,
        'method': 'not_supported',
        'status': 'experimental',
        'summary': 'This model does not expose a verified saliency or attention map suitable for evidence-grade explanation. Any heatmap would be experimental and should not be treated as proof of authenticity.',
    }
