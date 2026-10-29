# Demo Script (5-10 minutes)

## 1. Introduction (30-45 sec)
"This is VERITAS AI, a secure image-analysis system for AI image review and forensic-style triage."

## 2. Problem and motivation (45-60 sec)
"Modern media can be generated or manipulated at scale, so teams need a structured workflow for image triage and review."

## 3. Frontend walkthrough (1-2 min)
"Here is the landing page, detector screen, history page, and methodology page. The product is designed for a professional review workflow."

## 4. Upload and inference demo (2-3 min)
"I upload an image, the backend validates it, and the model returns a score and prediction. We do not treat it as definitive proof; we treat it as a signal for review."

## 5. Metadata and forensics (1-2 min)
"We inspect image dimensions, format, mode, SHA-256, and safe EXIF tags. If metadata is absent, we clearly state that it is not evidence of AI generation."

## 6. History and access control (1 min)
"Each analysis is stored behind authentication and tied to the user. Deletion and retrieval are governed by ownership rules."

## 7. Limitations and future scope (1 min)
"The current model is pretrained and should be used as a triage tool. Future work includes stronger evaluation pipelines, calibration analysis, and more robust explainability support."

## 8. Closing (20-30 sec)
"This project demonstrates a practical, responsible AI review system that balances technical capability with honest limitations."
