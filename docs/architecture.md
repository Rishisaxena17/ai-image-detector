# VERITAS AI Architecture

## System overview

VERITAS AI is a full-stack B.Tech major-project system built as a local-first forensic review application. The frontend is a Vite + React + TypeScript app; the backend is a FastAPI service that validates uploads, persists records, and runs inference using a Hugging Face image-classification model.

## Layered architecture

1. Client layer
   - React frontend for auth, upload, analysis, history and methodology screens
   - Browser uploads are sent through the authenticated API using JWT bearer tokens

2. API layer
   - FastAPI routes for auth, analysis, model status, and forensics inspection
   - Request validation, file size limits, MIME checks, and access-control enforcement

3. Persistence layer
   - SQLite database with SQLAlchemy ORM
   - User and Analysis tables with hashed password storage and per-user record ownership

4. Inference layer
   - ModelService loads a pretrained classifier from Hugging Face cache
   - Input is validated, preprocessed and scored with softmax output mapped to user-facing labels

5. File storage layer
   - Uploaded image files are kept under backend/uploads for the configured retention interval

## Data flow

Upload -> Validation -> Model prediction -> DB persistence -> History/detail UI

## Key design notes

- No secrets are stored in frontend code.
- JWT tokens are used for user session authentication.
- Model predictions are treated as triage signals, not definitive proof.
- Metadata absence is not treated as evidence of AI generation.
