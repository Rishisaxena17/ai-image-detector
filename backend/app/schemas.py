from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class UserCreate(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    full_name: str = Field(..., min_length=2, max_length=255)
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenOut(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: UserOut


class AnalysisOut(BaseModel):
    id: str
    owner_id: str
    created_at: datetime
    prediction: str
    score: float
    model_id: str
    model_version: str
    processing_time_ms: int
    is_inconclusive: bool
    limitation_notice: str
    file_name: str
    content_type: str
    file_size_bytes: int
    file_fingerprint: str | None = None
    image_width: int
    image_height: int
    retention_policy: str
    labels: list[dict[str, object]] | None = None

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_orm(cls, obj: object) -> 'AnalysisOut':
        return cls.model_validate(obj)


class AnalysisListResponse(BaseModel):
    items: list[AnalysisOut]
    page: int
    page_size: int
    total: int


class HealthResponse(BaseModel):
    status: str
    service: str
    model_ready: bool


class ModelStatusResponse(BaseModel):
    model_id: str
    ready: bool
    device: str
    cache_dir: str
    labels: list[str]
    load_error: str | None
