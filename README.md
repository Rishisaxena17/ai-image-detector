# VERITAS AI

VERITAS AI is a B.Tech CSE major-project system for secure AI image review and forensic-style analysis. The project combines a modern React frontend, a FastAPI backend, a local SQLite database, and a real pretrained image-classification pipeline for review support.

## Project status

### Verified / running features
- Secure user authentication and access control
- Real image upload validation using Pillow
- Real model inference via a pretrained Hugging Face image classifier
- Persistent analysis records with ownership checks
- Metadata inspection with safe EXIF filtering
- SHA-256 file fingerprinting
- Quality-robustness checks for resized, JPEG-compressed, and mildly altered copies
- Forensics API response with explicit limitations and non-proof messaging
- API contracts verified by automated tests

### Experimental / not yet production-grade
- Saliency or heatmap visualization is experimental and not enabled for the active model
- Advanced explainability methods require model-specific support and a verified explanation pipeline
- Full PDF export and dashboard analytics are still pending

### Planned / pending
- Full train/validation/test benchmarking pipeline with leakage control
- Per-class metrics, ROC-AUC, confusion matrix and calibration analysis on a real benchmark set
- Production deployment and cloud hosting
- Full model-card page with verified data sources and license details

## Screenshots placeholder

Add your screenshots before the final viva/demo submission:

- Landing page: `docs/screenshots/landing.png`
- Detector page: `docs/screenshots/detector.png`
- History page: `docs/screenshots/history.png`
- Analysis detail: `docs/screenshots/detail.png`

## Tech stack

Frontend:
- React 19
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

Backend:
- FastAPI
- SQLAlchemy
- SQLite for local development
- JWT auth with passlib/bcrypt
- Pillow for validation and metadata parsing
- Hugging Face Transformers + PyTorch model runtime

## Local setup on Intel Mac (verified workflow)

Use Python 3.11; do not use the default system Python 3.14 for this project.

### 1) Open the project in VS Code

```bash
cd "/Users/apple/rishi project/clon"
```

### 2) Create a Python environment

```bash
cd "/Users/apple/rishi project/clon"
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
```

### 3) Install Python backend dependencies

```bash
cd "/Users/apple/rishi project/clon"
python -m pip install -r backend/requirements.txt
```

### 4) Install frontend dependencies

```bash
cd "/Users/apple/rishi project/clon"
npm install
```

### 5) Configure environment files

```bash
cd "/Users/apple/rishi project/clon"
cp .env.example .env
cp backend/.env.example backend/.env
```

### 6) Start the backend

```bash
cd "/Users/apple/rishi project/clon"
source .venv/bin/activate
export PYTHONPATH="/Users/apple/rishi project/clon/backend"
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 7) Start the frontend

Open a second terminal:

```bash
cd "/Users/apple/rishi project/clon"
npm run dev -- --host 0.0.0.0
```

### 8) Open the application

- Frontend: http://localhost:5173
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/api/v1/health

## Verified commands

Backend tests:

```bash
cd "/Users/apple/rishi project/clon"
source .venv/bin/activate
export PYTHONPATH="/Users/apple/rishi project/clon/backend"
/usr/local/bin/python3.11 -m pytest backend/tests -q
```

Frontend build:

```bash
cd "/Users/apple/rishi project/clon"
npm run build
```

## Important notes

- The model cache is stored under `.hf_cache` in the project root.
- Local uploads are stored under `backend/uploads`.
- Local database is `backend/veritas.db`.
- No credentials or secrets should be placed in frontend code.
- Do not treat metadata absence or heatmaps as proof of authenticity.

## Deployment guidance

### Recommended hosting

Frontend:
- Vercel or Netlify

Backend:
- Render, Railway, or a small VPS with Gunicorn + Nginx

Model asset strategy:
- Store model weights in a persistent artifact bucket or HF cache mounted to the app container.
- Use a warm container or prewarmed model cache to reduce cold starts.
- Keep memory allocation above 2 GB for CPU inference on a small host.
- Use 60–120 second timeouts for inference requests depending on model size and concurrency.

### Production config

- Use HTTPS
- Restrict CORS to your production domains only
- Store secrets in environment variables or a secret manager
- Keep uploads and DB in persistent volumes
- Use a retention policy for stored images
- Disable debug output in production

### Realistic alternative if free-tier limits are exceeded

If the model exceeds free-tier limits, move the backend to a small CPU-optimized VPS with a cached model, or use a GPU-backed service if throughput needs increase.

## Academic documentation

## Training a project-specific detector

The optional `model_training/` pipeline trains a logistic-regression classifier on
normalized CLIP image features. Keep the dataset and generated artifacts local:

```text
model_training/dataset/
├── train/{real,ai}/
├── val/{real,ai}/
└── test/{real,ai}/
```

Install its dependencies in a dedicated environment, then train:

```bash
python -m pip install -r model_training/requirements.txt
python model_training/train.py --dataset model_training/dataset
python model_training/predict.py /path/to/test-image.jpg
```

The training script selects the classification threshold on the validation split
and reports validation/test accuracy, precision, recall, F1, ROC-AUC, and a
confusion matrix. The test split must remain untouched until final evaluation.
Avoid duplicates across splits and reserve generators or image transformations
for an unseen generalization test.

To use the resulting detector in the FastAPI backend, set
`TRAINED_ARTIFACT_DIR` in `backend/.env` to the generated `model_training/artifacts`
directory and restart the backend. The existing detector remains the default when
this setting is empty.

Additional documentation is available in the `docs/` folder:

- `docs/architecture.md`
- `docs/data-flow.md`
- `docs/api.md`
- `docs/database-schema.md`
- `docs/project-deliverables.md`
- `docs/viva.md`
- `docs/demo-script.md`
- `docs/final-report-guide.md`
- `docs/checklist.md`
- `docs/deployment.md`

## License and disclaimer

This project is intended for educational and demonstration purposes. It is designed for responsible review support and should not be presented as a definitive forensic authority.
