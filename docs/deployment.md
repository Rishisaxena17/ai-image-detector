# Deployment guidance

## Frontend deployment

Recommended: Vercel or Netlify.

- Build command: `npm run build`
- Output folder: `dist`
- Environment variables:
  - `VITE_API_BASE_URL`
  - `VITE_APP_NAME`
  - `VITE_DEMO_MODE`

## Backend deployment

Recommended: Render, Railway, or a small VPS.

- Entry point: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- Required environment variables:
  - `DATABASE_URL`
  - `SECRET_KEY`
  - `MODEL_ID`
  - `MODEL_CACHE_DIR`
  - `MODEL_DEVICE`
  - `UPLOAD_DIR`
  - `CORS_ORIGINS`
  - `RETENTION_DAYS`

## Model storage and cost notes

- Keep model weights in a persistent volume or remote artifact store.
- Cold starts can be slow when the model must be downloaded on the first run.
- On a small CPU host, expect heavier startup time and memory use.
- A GPU instance is preferred if you plan to serve concurrent model requests.
- If free-tier limits are too tight, use a small CPU VPS with a mounted cache; if higher throughput is needed, move to a GPU-backed service.

## Production hardening

- Restrict CORS to the deployed frontend domain only
- Use HTTPS and a reverse proxy
- Store secrets in environment variables or a secret manager
- Enable persistent volume backup for the SQLite database and uploads
- Keep file retention and cleanup automation enabled
