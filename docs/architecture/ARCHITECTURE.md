# 🏗️ Detailed Technical Architecture — Eco Farm v4.0

This document describes the architectural blueprint of **Eco Farm v4.0 (Solarpunk Cognitive Agriculture OS)**. It incorporates the microservices structure, WebMCP agentic bridges, post-quantum cryptography, and edge-native spiking neural networks.

---

## 1. System Overview

```
                                  ┌───────────────────────────────┐
                                  │   Farmer BCI Neuro-Headset    │
                                  └───────────────┬───────────────┘
                                                  │
 ┌──────────────────────┐         ┌───────────────▼───────────────┐         ┌──────────────────────┐
 │   React Native HUD   ├────────►│    NestJS API Gateway Hub     │◄────────┤   Next.js PWA HUD    │
 │     (Mobile client)  │         │          (Port 3000)          │         │      (Dashboard)     │
 └──────────────────────┘         └───────────────┬───────────────┘         └──────────────────────┘
                                                  │
         ┌────────────────────────┬───────────────┼───────────────┬────────────────────────┐
         │                        │               │               │                        │
 ┌───────▼────────┐       ┌───────▼────────┐┌─────▼────────┐┌─────▼────────┐       ┌───────▼────────┐
 │   BCI Module   │       │ Quantum Module ││Sensor Module ││Disease Module│       │Blockchain Mod  │
 │ (Attention HUD)│       │ (QAOA Rotation)││ (TimescaleDB)││ (CRISPR/RAG) │       │ (Solana Mint)  │
 └────────────────┘       └────────────────┘└──────┬───────┘└─────┬────────┘       └────────────────┘
                                                   │              │
                                                   │              └───────────────┐
                                                   │                              │
                                          ┌────────▼──────────────┐      ┌────────▼──────────────┐
                                          │  PyTorch LIF-SNN      │      │  FastAPI CRISPR DNA   │
                                          │  (Edge AI Classifier) │      │  (Needleman-Wunsch)   │
                                          └───────────────────────┘      └───────────────────────┘
```

---

## 2. Microservice Layer & API Gateway (`apps/api`)

The **NestJS API Gateway** coordinates auth, database synchronization, quantum crop optimization, and decentralized ledgers:

### 2.1 Passkey Biometric Auth Module (`auth`)
- **Passkeys (WebAuthn):** Hardware credential registration (`POST /auth/passkey/register-options` and `/register-verify`) and session assertion (`POST /auth/passkey/login-options` and `/login-verify`).
- **TEE Attestation Verification:** Validates hardware enclave claims (Intel TDX) to ensure a secure boot environment (`POST /auth/attest`).

### 2.2 BCI Cognitive Autopilot Module (`bci`)
- **Real-time Telemetry:** Saves attention scores, stress levels, and cognitive load indexes (`POST /bci/state`).
- **Neuro-Interface:** Adjusts screen visual density in real-time based on cognitive overload states (`GET /bci/history/:userId`).

### 2.3 Sensor Telemetry Module (`sensor`)
- **LoRaWAN IoT Sync:** Registers Soil Moisture, Weather, and Leaf Electrophysiology devices (`POST /sensors/register`).
- **TimescaleDB Persistence:** Records real-time sensor readings (`POST /sensors/reading`) using hypertable time-indexed keys (`[time, deviceId, metric]`).

### 2.4 Disease Event Tracking Module (`disease`)
- **CRISPR Verification:** Cleaves Cas12/Cas13 targets, running PCR alignments against biological databases (`POST /disease/event`).
- **Pathogen RAG Diagnosis:** Retrieves vectorized treatments from local vector databases (`PestEmbedding`) for immediate resolution.

### 2.5 Blockchain & Quantum Modules (`blockchain` / `quantum`)
- **Solana Minting:** Issues verified carbon credit tokens signed via Dilithium keys (`POST /blockchain/mint`).
- **Quantum QAOA Solver:** Optimizes multi-season crop rotation matrices to maximize yields (`POST /quantum/optimize`).

---

## 3. Edge-AI & Bioinformatics Engines

### 3.1 PyTorch Spiking Neural Network (`apps/agents/src/snn_engine.py`)
- **Biological Neurons:** Uses Leaky Integrate-and-Fire (LIF) cells to model passive passive leak currents and membrane potential voltage decay.
- **Offline Outage Buffer:** Persists high-priority alerts to local JSON buffers during telemetry backhaul failures, flushing them automatically upon reconnection.

### 3.2 FastAPI CRISPR DNA Alignment (`apps/bioinformatics/src/main.py`)
- **Needleman-Wunsch Alignment:** Executes global DNA sequence alignments to classify plant diseases (Rice Blast, Bacterial Canker, Aphid Necrosis).
- **Fluorescence Cleavage Intensity:** Evaluates Cas12/Cas13 cleavage rates to detect active pathogen vector replication.

---

## 4. Multi-Tier Data Layer

- **PostgreSQL Database:** Stores users, farms, BCI records, and audit actions securely.
- **TimescaleDB Hypertable:** Handles high-volume, append-only sensor telemetry.
- **Prisma Client Engine:** Coordinates multi-package TypeScript type-portability and safe database transactions.
