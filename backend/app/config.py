from __future__ import annotations

import os
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = ROOT_DIR.parent

MODEL_ID = os.getenv('MODEL_ID', 'aaronkantrowitz/ai-human-generated-image-detection')
MODEL_CACHE_DIR = os.getenv('MODEL_CACHE_DIR', str(PROJECT_ROOT / '.hf_cache'))
MODEL_DEVICE = os.getenv('MODEL_DEVICE', 'cpu')
MAX_IMAGE_SIZE_MB = int(os.getenv('MAX_IMAGE_SIZE_MB', '10'))
MAX_IMAGE_DIMENSION = int(os.getenv('MAX_IMAGE_DIMENSION', '4096'))
ALLOWED_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp'}
ALLOWED_MIME_TYPES = {'image/png', 'image/jpeg', 'image/webp'}
CONFIDENCE_THRESHOLD = float(os.getenv('CONFIDENCE_THRESHOLD', '0.55'))

DATABASE_URL = os.getenv('DATABASE_URL', f'sqlite:///{PROJECT_ROOT / "backend" / "veritas.db"}')
UPLOAD_DIR = Path(os.getenv('UPLOAD_DIR', str(PROJECT_ROOT / 'backend' / 'uploads')))
RETENTION_DAYS = int(os.getenv('RETENTION_DAYS', '7'))

SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-change-me')
ALGORITHM = os.getenv('ALGORITHM', 'HS256')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '120'))

CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')
MAX_REQUESTS_PER_MINUTE = int(os.getenv('MAX_REQUESTS_PER_MINUTE', '60'))
