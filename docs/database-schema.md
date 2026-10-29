# Database schema

## users
- id: string
- email: string
- full_name: string
- hashed_password: string
- created_at: datetime

## analyses
- id: string
- owner_id: string
- created_at: datetime
- prediction: string
- score: float
- model_id: string
- model_version: string
- processing_time_ms: int
- is_inconclusive: bool
- limitation_notice: text
- file_name: string
- content_type: string
- file_size_bytes: int
- file_fingerprint: string | null
- image_width: int
- image_height: int
- storage_path: string
- retention_policy: string
- labels: JSON

## Relationship
- One user has many analyses.
- Each analysis belongs to exactly one user.
