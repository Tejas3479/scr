# 🚀 QUICK START — Eco Farm v3.0 Local Services

This quick start guide explains how to spin up the local PostgreSQL database, start all microservices, and run diagnostic validation.

---

## 🛠️ Step 1: Start User-Space Database (Port 5433)

To avoid Windows Administrator permission checks and port clashes, we run PostgreSQL 18 on port **5433** with trust authentication:

```powershell
# 1. Initialize the PostgreSQL cluster files
initdb -D database/local_pg_data -U postgres --auth=trust

# 2. Launch the database engine
pg_ctl -D database/local_pg_data -o "-p 5433" -l database/local_pg_data/server.log start

# 3. Create the ecofarm target database
psql -U postgres -p 5433 -h localhost -d postgres -c "CREATE DATABASE ecofarm;"
```

---

## 🏗️ Step 2: Build & Seed Database Models

Deploy the Prisma schema and compile the monorepo packages:

```powershell
# Install Node modules
pnpm install

# Build all TypeScript modules
pnpm run build

# Push database schema tables
pnpm --filter @eco-farm/db exec prisma db push --accept-data-loss
```

---

## ⚡ Step 3: Run Dev Servers

Run each of these commands in separate terminal shells to activate all microservices:

### Terminal 1 — NestJS API Gateway (Port 3000)
```powershell
pnpm --filter @eco-farm/api run dev
```

### Terminal 2 — WebMCP Server (Port 3001)
```powershell
pnpm --filter @eco-farm/mcp-server run dev
```

### Terminal 3 — Next.js PWA Dashboard (Port 3007)
```powershell
pnpm --filter farmquest-web-dashboard run dev
```

### Terminal 4 — CRISPR Bioinformatics Service (Port 3008)
```powershell
python services/bioinformatics-service/src/main.py
```

### Terminal 5 — LangGraph AI Agent Engine (Port 8000)
```powershell
python -m uvicorn apps.agents.src.main:app --host 0.0.0.0 --port 8000
```

---

## 🚦 Step 4: Run Diagnostic Verifications

Validate API health and endpoint wiring:

```powershell
# 1. Verify NestJS Gateway (Returns health/status)
Invoke-RestMethod -Uri http://localhost:3000/auth/attest -Method Post

# 2. Verify Solana Credit Mint Wrapper (Returns transaction signature)
Invoke-RestMethod -Uri http://localhost:3000/blockchain/mint -Method Post -Body (@{ farmerWalletAddressHex='AgriFarmerX992b8dff2384a88fbc923e'; amountTonnes=10 } | ConvertTo-Json) -ContentType "application/json"

# 3. Verify LangGraph Agent Engine Routing (Returns routed graph state)
Invoke-RestMethod -Uri http://localhost:8000/agent/query -Method Post -Body (@{ query='Hello, detect pests'; thread_id='test-1' } | ConvertTo-Json) -ContentType "application/json"
```
