# 📊 System Architecture Diagrams — Eco Farm v4.0

This document contains flow and structural diagrams detailing the **Eco Farm v4.0** micro-cybernetic infrastructure.

---

## 1. High-Level Cognitive Architecture Flow

```
                      [ Farmer BCI Neural Headset ]
                                   │
                                   ▼
    [ Attention / Stress / Cognitive Load Scores Recorded ]
                                   │
                                   ▼
       [ Recorded to PostgreSQL via BciModule (Port 3000) ]
                                   │
                                   ▼
           [ HUD visuals automatically adjust in density ]
```

---

## 2. LoRaWAN Edge IoT Telemetry Flow

```
   [ LoRaWAN Soil & Leaf Electrophysiology Sensor Devices ]
                               │
                               ▼
        [ Edge-Inference via PyTorch LIF-SNN Classifier ]
                               │
            ┌──────────────────┴──────────────────┐
            ▼ (Backhaul Up)                       ▼ (Backhaul Down)
  [ Recorded to TimescaleDB ]             [ Logged to local JSON ]
  [ composite: time+deviceId+metric ]     [ Outage Alert Buffer  ]
                                                  │
                                                  ▼ (Reconnected)
                                          [ Flushed to Gateway ]
```

---

## 3. CRISPR PCR Pathogen DNA Diagnostics Flow

```
                [ Raw PCR DNA Sequence Captured ]
                               │
                               ▼
     [ Sent to FastAPI Bioinformatics Service (Port 3008) ]
                               │
                               ▼
     [ Sequence aligned via Needleman-Wunsch Algorithm ]
                               │
                               ▼
           [ Is Alignment Score > 75% & Cas Active? ]
            ┌──────────────────┴──────────────────┐
            ▼ Yes                                 ▼ No
  [ Critical Pathogen Detected ]          [ Crop Registers Healthy ]
  [ Fetch RAG Treatment Bio-Spray ]
  [ Record DiseaseEvent to PostgreSQL ]
```

---

## 4. Decentralized Post-Quantum Ledger Flow

```
               [ Calculated Carbon Offsets (Tonnes) ]
                               │
                               ▼
          [ Signed via CRYSTALS-Dilithium Private Key ]
                               │
                               ▼
        [ Enclosed in AES-GCM Envelope asymmetric wrapper ]
                               │
                               ▼
       [ Sent to Solana ledger minting (BlockchainModule) ]
                               │
                               ▼
     [ Simulated Minting TX Receipt Recorded in CarbonCredit ]
```
