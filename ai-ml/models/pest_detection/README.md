# 🔬 Pathogen & Pest Detection Engine — Eco Farm v4.0

The pathogen and pest detection engine integrates computer vision models with real-time biological and spiking neural systems.

---

## ⚡ Multi-Stage Diagnostic Pipeline

1. **Computer Vision Layer:**
   - **Base Model:** YOLOv8 and EfficientNet-B4 for visual foliar pest and leaf disease detection.
   - **Inference Endpoint:** `/api/v1/ai/image/analyze`

2. **Neuromorphic Edge Layer (LIF-SNN):**
   - **Framework:** PyTorch Leaky Integrate-and-Fire (LIF) spiking neural network (`apps/agents/src/snn_engine.py`).
   - **Edge Telemetry:** Processes LoRaWAN electrophysiological signals at the edge. If the backhaul is down, alerts are buffered locally and flushed upon reconnection.

3. **CRISPR Sequence Alignment Layer:**
   - **Framework:** Needleman-Wunsch global DNA sequence aligner (`apps/bioinformatics/src/services/aligner.py`).
   - **Pathogen Matches:** Aligns PCR sequence reads against high-risk genomic tracks (e.g., Rice Blast Fungus, Tomato Bacterial Canker, Aphid-borne Viral Vector) to trigger automated biological spray applications.
