# Final Checklist

## Verified
- Frontend installs and builds successfully with `npm install` and `npm run build`
- Frontend lint passes with no blocking errors
- Backend test suite passes with `pytest`
- Real model loads successfully in the current macOS environment
- Real image prediction executes successfully on a sample image
- Auth routes, upload validation and API contracts are verified
- Access control and ownership checks pass
- Metadata inspection endpoint is implemented and tested
- Documentation files are created and structured for academic use

## Partially verified
- Model performance metrics are not yet measured on a dedicated dataset; evaluation is pending.
- PDF export, advanced charts, and deep forensic dashboards are not yet implemented as production-grade features.
- Explainability remains experimental and model-dependent.

## Incomplete
- Train/validation/test benchmarking pipeline with leakage prevention
- Per-class metrics, ROC-AUC, confusion matrices, calibration analysis
- Production deployment to a cloud provider
- Full deployment verification and live hosting
- Advanced PDF reporting and exportable report generation
- Model card pages with verified training-data and license details
