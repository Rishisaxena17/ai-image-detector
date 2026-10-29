from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.analysis_routes import router as analysis_router
from app.auth_routes import router as auth_router
from app.config import CORS_ORIGINS, MODEL_ID
from app.database import init_db
from app.forensics_routes import router as forensics_router

app = FastAPI(
    title='VERITAS AI Inference API',
    version='0.1.0',
    description='Local AI image detector pipeline for the VERITAS AI project.',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'] if CORS_ORIGINS == ['*'] else CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth_router)
app.include_router(analysis_router)
app.include_router(forensics_router)


@app.on_event('startup')
def startup_event() -> None:
    init_db()


@app.get('/')
def root() -> dict:
    return {
        'message': 'VERITAS AI inference service is running.',
        'model_id': MODEL_ID,
    }
