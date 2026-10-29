# VERITAS AI Academic Deliverables

## 1. Abstract

VERITAS AI is a B.Tech CSE major project focused on AI image detection and forensic review. The system combines secure file upload, authenticated analysis records, model inference, and metadata inspection to help users assess whether an image may have synthetic or AI-generated characteristics. The project emphasizes responsible design, transparency, and evidence-based interpretation rather than definitive forensic proof.

## 2. Problem statement

Digital media is increasingly used in misinformation, impersonation, and social manipulation. While AI-generated images can be useful in creative applications, they can also be used to spread false narratives. A practical system is needed to provide a structured triage workflow that highlights suspicious patterns while still making the limitations clear.

## 3. Objectives
- Build a secure image-analysis workflow for authenticated users.
- Use a real pretrained model to process uploaded images.
- Persist analysis records with evidence metadata and file integrity tracking.
- Support forensics-oriented inspection without claiming definitive authenticity proof.
- Provide project documentation and evaluation artifacts suitable for academic review.

## 4. Methodology

The project follows an applied systems-development approach. It combines a frontend interface, a backend API, a database, and a live model inference service. The model is treated as a decision-support tool rather than an absolute authority. Each upload is validated, stored, scored, and logged for review.

## 5. Scope

Included:
- Secure upload and authentication
- Real model inference
- Metadata inspection
- Data persistence and access control
- Quality-robustness checks
- Documentation and evaluation artifacts

Out of scope for this version:
- Production deployment to a live public cloud environment
- Full training pipeline from scratch
- Verified saliency maps for a specific model without model support
- Guarantee of forensic certainty

## 6. Literature review

1. Dosovitskiy, A., et al. (2021). An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale.
2. He, K., et al. (2016). Deep Residual Learning for Image Recognition.
3. Jo, Y., & Park, J. (2019). ScGAN: Realistic and Manipulated Image Detection Through a Generative Model.
4. Wang, R., et al. (2020). CNN-generated images are surprisingly easy to spot... for now.
5. Goodfellow, I., et al. (2014). Generative Adversarial Nets.
6. Karras, T., et al. (2019). StyleGAN2: Analyzing and Improving the Quality of GAN Synthesis.
7. Rombach, R., et al. (2022). High-Resolution Image Synthesis with Latent Diffusion Models.

## 7. Test plan and evaluation methodology

- Unit and API tests for auth and analysis workflows
- Model load checks under the current environment
- Prediction inference verification on a real sample image
- Validation of access control and persisted records
- Metadata inspection endpoint validation

## 8. Limitations

- The current model is a pretrained classifier and not a custom-trained detector.
- Results are not proof of authenticity.
- Performance depends on the model architecture and dataset coverage.
- Local environment constraints affect runtime and cold-start behavior.

## 9. Future work

- Add a proper train/validation/test benchmark pipeline with leakage control.
- Integrate per-class metrics, confidence calibration, and dataset-level evaluation.
- Add PDF report generation and dashboard analytics.
- Improve explainability only when supported by the chosen model.
- Deploy to a managed cloud platform with persistent storage and monitoring.
