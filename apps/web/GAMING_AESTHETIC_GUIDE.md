# 🌌 Solarpunk Cognitive HUD Dashboard Guide — Eco Farm v4.0

This guide details how to implement and extend the **Solarpunk Cognitive HUD Dashboard (v4.0)** across the web client in `apps/web/` (farmquest-web-dashboard).

---

## 🎨 Color Palette & Cyber-Glass

We use vibrant, high-contrast HSL gradients and cyber-glass backgrounds:
- **Matrix Green:** `#00FF41` - Standard operations, healthy indicators.
- **Neon Cyan:** `#00F0FF` - LoRaWAN sensor feeds and telemetry metrics.
- **Quantum Gold:** `#FFB800` - Qiskit crop rotation and Solana minting tracks.
- **Warning Red:** `#FF0055` - High-stress states, pathogen alerts, and edge outages.

---

## 🧠 Brain-Computer Interface (BCI) HUD Visuals

The dashboard dynamically adapts its visual density based on real-time focus levels:
1. **Glow Pulsation:** The outer dashboard box-shadow pulses at a rate proportional to `attentionScore`.
2. **Stress Color Mapping:** If `stressLevel` exceeds 0.70, borders change from Matrix Green to Warning Red, and visual widgets transition to a minimalist, low-cognitive-load mode to prevent mental fatigue.

---

## 🧬 CRISPR Alignment Visualizer

For real-time PCR diagnostics:
- **DNA Sequence Trace:** The raw DNA sequence read is displayed in `tech-mono` font. Matching base pairs from the Needleman-Wunsch aligner are highlighted with glowing green text, while mismatches flash yellow.
- **Cas12/Cas13 Cleavage Bar:** An animated progress bar displaying fluorescence intensity. If intensity > 0.65, a particle burst is triggered to denote active cleavage.

---

## 📡 LIF-SNN Outage Status

For edge LoRaWAN telemetry:
- **Spike Train Visualizer:** A small canvas showing ticking spike pulses as classified by the edge LIF-SNN model.
- **Offline Buffering indicator:** Displays a pulsing red warning bar when the LoRaWAN backhaul is offline, showing the number of buffered alerts.
