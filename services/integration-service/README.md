# 🔌 Historical Integration Service — Consolidated into `apps/api`

## ⚠️ Architectural Deprecation Notice

In **Eco Farm v4.0 (Solarpunk Cognitive Agriculture OS)**, the IoT, weather, market, and government API integrations have been fully consolidated into the **NestJS API Gateway workspace** (`apps/api`), specifically the `SensorModule` (handling LoRaWAN IoT telemetry sync) and `BlockchainModule` (handling Solana multi-sig minting).

---

## ⚡ Active Integration Infrastructure

All telemetry ingestion and system integrations are running inside:
- 📡 **Active Gateway:** [apps/api](file:///c:/Users/tejas/Downloads/scr/apps/api)
- 🧪 **Active Bioinformatics:** [apps/bioinformatics](file:///c:/Users/tejas/Downloads/scr/apps/bioinformatics) (FastAPI global DNA sequence alignments)
