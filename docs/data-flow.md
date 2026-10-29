# Data Flow Diagram

```mermaid
flowchart LR
    A[User uploads image] --> B[Frontend validation]
    B --> C[FastAPI /api/v1/analyze]
    C --> D[Image validation + metadata parsing]
    D --> E[ModelService.predict]
    E --> F[Prediction + score]
    F --> G[SQLite persistence]
    G --> H[History/detail views]
    C --> I[Stored uploaded file]
    H --> J[Analyst review / export / report]
```

## Notes

- Metadata inspection is a separate forensics step and does not determine authenticity.
- The model output is stored with timestamps and a SHA-256 fingerprint when available.
- Delete operations remove the DB record and the local file if it exists.
