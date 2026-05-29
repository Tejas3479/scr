# 🚀 Quick Start Guide — Eco Farm v4.0

This guide gets you up and running with **Eco Farm v4.0 (Solarpunk Cognitive Agriculture OS)** in under 5 minutes.

---

## 🏗️ Technical Architecture Core

Our monorepo is built on **pnpm workspaces** and managed by **Turborepo**:
- **NestJS API Gateway** (`apps/api`): Port `3000`
- **WebMCP Server** (`apps/mcp-server`): Port `3001`
- **Next.js Dashboard** (`apps/web`): Port `3007`
- **CRISPR Alignment Service** (`apps/bioinformatics`): Port `3008` (Python FastAPI)
- **LangGraph Routing Agent** (`apps/agents`): Port `8000` (Python FastAPI & PyTorch SNN)

---

## ⚡ Local Setup Steps

### 1. Install Workspace Packages
```bash
pnpm install
```

### 2. Initialize the User-Space Database (PostgreSQL 18)
To prevent privilege prompt popups or native port conflicts, we initialize and run PostgreSQL on port `5433`:
```bash
# Initialize PostgreSQL directory
initdb -D database/local_pg_data -U postgres --auth=trust

# Start the PostgreSQL service
pg_ctl -D database/local_pg_data -o "-p 5433" -l database/local_pg_data/server.log start

# Create the ecofarm database
psql -U postgres -p 5433 -h localhost -d postgres -c "CREATE DATABASE ecofarm;"
```

### 3. Build Packages & Push Schema
Generate Prisma client and build typescript dependencies:
```bash
# Build and compile all workspaces
pnpm run build

# Push models directly to the database
pnpm --filter @eco-farm/db exec prisma db push --accept-data-loss
```

### 4. Start all Services
```bash
# NestJS Backend API (Port 3000)
pnpm --filter @eco-farm/api run dev

# WebMCP Server (Port 3001)
pnpm --filter @eco-farm/mcp-server run dev

# Next.js Solarpunk HUD Dashboard (Port 3007)
pnpm --filter farmquest-web-dashboard run dev

# FastAPI CRISPR PCR Aligner (Port 3008)
python apps/bioinformatics/src/main.py

# FastAPI LangGraph SNN Agent (Port 8000)
python -m uvicorn apps.agents.src.main:app --host 0.0.0.0 --port 8000
```

---

## 📡 Verifying Endpoints via cURL

Open a new shell and execute these functional, verified cURL commands to test the running API stack:

### 🧠 Brain-Computer Interface (BCI State)
```bash
curl -X POST http://localhost:3000/bci/state \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "usr_dev_01",
    "attentionScore": 0.88,
    "stressLevel": 0.15,
    "cognitiveLoad": 0.32
  }'
```

### 📡 LoRaWAN IoT Sensor Telemetry
```bash
curl -X POST http://localhost:3000/sensors/reading \
  -H "Content-Type: application/json" \
  -d '{
    "time": "2026-05-30T00:00:00Z",
    "deviceId": "dev_soil_moisture_01",
    "metric": "moisture",
    "value": 42.5
  }'
```

### 🧬 CRISPR PCR sequence alignment (FastAPI)
```bash
curl -X POST http://localhost:3008/api/bioinformatics/align-pcr \
  -H "Content-Type: application/json" \
  -d '{
    "probe_id": "pcr_probe_rice_01",
    "sequence_read": "ATGCGTCGATTCGATCGATTCGAT",
    "fluorescence_intensity": 0.89
  }'
```

### 💻 Quantum Crop Rotation Solver (QAOA)
```bash
curl -X POST http://localhost:3000/quantum/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "fieldSizeAcres": 150.0,
    "availableCrops": ["Wheat", "Barley", "Soybean"],
    "nitrogenContent": 0.65
  }'
```
