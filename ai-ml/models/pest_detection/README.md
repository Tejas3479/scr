# Pest Detection Model

## Overview
Computer vision model for detecting pests and diseases in crop images.

## Model Architecture
- Base Model: EfficientNet-B4
- Training Framework: TensorFlow/Keras
- Input: 224x224x3 RGB images
- Output: Multi-class classification (pest types, disease types, healthy)

## Training Data
- Dataset: Agricultural pest and disease images
- Augmentation: Rotation, flipping, color jitter
- Train/Val/Test Split: 70/15/15

## Deployment
- Server-side: TensorFlow Serving
- Edge/Mobile: TensorFlow Lite
- Inference API: `/api/v1/ai/image/analyze`

## Performance
- Accuracy: ~92%
- Inference Time: < 1 second
- Model Size: ~45MB (full), ~12MB (lite)


