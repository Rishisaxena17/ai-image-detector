# Viva Questions and Concise Answers

## 1. What is the main problem this project addresses?
It helps users review uploaded images using an AI-assisted triage workflow with transparent limitations.

## 2. Why is metadata not treated as proof?
Image metadata may be absent, stripped, or incomplete, so it cannot prove authenticity by itself.

## 3. Why is the model output not considered definitive evidence?
Model scores are probabilistic, task-dependent and may be affected by image quality, compression and dataset coverage.

## 4. What is the role of the backend?
It validates uploads, checks auth, stores records, and runs the actual inference pipeline.

## 5. What are the strengths of the project?
It is full-stack, authenticated, real-model-based, and documented with a clear limitations-first design.

## 6. What are the limitations?
It uses a pretrained model rather than a custom academic training pipeline, and it does not claim forensic certainty.

## 7. How would you improve the system further?
By adding evaluation datasets, calibration analysis, better explainability, and production deployment.
