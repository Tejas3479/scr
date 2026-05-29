# 🌾 Eco Farm v4.0 — The Post-Quantum Solarpunk Cognitive Agriculture OS

Welcome to the production-ready monorepo for **Eco Farm v4.0**, a state-of-the-art cognitive agriculture operating system. It fuses **spiking neural networks (SNN)**, **brain-computer interfaces (BCI)**, **post-quantum cryptography (CRYSTALS-Dilithium)**, **CRISPR diagnostics**, **LoRaWAN edge telemetry**, and **decentralized Solana ledgers** into a zero-trust, offline-first agricultural engine.

---

## 🚀 Architectural Vision & High-Tech Core

Eco Farm v4.0 represents the convergence of synthetic biology, quantum computing, and bio-cybernetics:
1. **LIF Spiking Neural Network (Edge AI):** A temporal Leaky Integrate-and-Fire neural network in PyTorch classifying plant pathogens on the edge with a fault-tolerant local outage buffer.
2. **CRISPR Sequence Alignment:** Real-time dynamic programming (Needleman-Wunsch global sequence aligner) that compares raw PCR field DNA sequence reads against target pathogen marker databases.
3. **BCI Cognitive Autopilot:** A brain-computer interface overlay tracking farmer attention, stress, and cognitive load to auto-adjust telemetry overlays.
4. **Post-Quantum Cryptography:** CRYSTALS-Dilithium signature modeling and double-envelope key-wrapping GCM methods.
5. **Solana Blockchain Minting:** Locally simulated, production-ready minting of verified carbon credit tokens with IPFS and Dilithium signature proofs.

---

## 🏗️ Monorepo Structure

Our codebase is organized as a Turborepo-managed `pnpm` workspace structure:

```
eco-farm-monorepo/
├── .github/             # Automated CI/CD K8s workflows (supporting Base64 & plaintext Kubeconfig)
├── apps/
│   ├── api/             # NestJS API Gateway (BCI, Sensor, Disease, Quantum, and Blockchain modules)
│   ├── mcp-server/      # Express WebMCP Server (search_knowledge, mint_carbon_credit)
│   ├── web/             # farmquest-web-dashboard (Solarpunk particles, Next.js PWA client HUD)
│   ├── agents/          # Multi-Agent Routing Engine & PyTorch LIF-SNN Edge Classifier
│   ├── bioinformatics/  # CRISPR DNA sequence alignment pipeline (FastAPI & Needleman-Wunsch aligner)
│   └── mobile/          # React Native mobile client HUD
├── packages/
│   └── db/              # Shared database module (Prisma client & Postgres migrations)
├── docs/
│   └── architecture/    # Consolidated system specs and architecture diagrams
├── database/
│   └── local_pg_data/   # User-space PostgreSQL database cluster
├── package.json         # Root package manager & Turborepo configurations
├── turbo.json           # Turborepo build caching & dependency pipeline
└── .env                 # Monorepo environment configurations
```

---

## 🛠️ Port & Service Mappings

When running locally, services run on these assigned ports:

- **Local PostgreSQL DB:** Port `5433` (Trust Authentication, database `ecofarm`)
- **NestJS API Gateway:** Port `3000` (FastAPI / Prisma Client / WebAuthn)
- **WebMCP Server:** Port `3001` (MCP tools bridge over Express endpoint `/mcp`)
- **Next.js PWA Client:** Port `3007` (Visual glassmorphic dashboard HUD)
- **CRISPR Diagnostics:** Port `3008` (Cas12/Cas13 Needleman-Wunsch sequence alignment APIs)
- **LangGraph Agent:** Port `8000` (FastAPI query routing engine)

---

## 🚀 Local Development Quickstart

### 1. Prerequisites
- **Node.js** (>= 18.0.0)
- **pnpm** (>= 8.0.0)
- **Python** (>= 3.10)
- **PostgreSQL 18** (binaries installed on PATH to run `pg_ctl` and `initdb`)

### 2. Database Initialization
A user-space PostgreSQL instance runs on port `5433` to prevent privilege prompt popups or port conflicts with native installations:
```bash
# Initialize the user-space database cluster
initdb -D database/local_pg_data -U postgres --auth=trust

# Start the database engine
pg_ctl -D database/local_pg_data -o "-p 5433" -l database/local_pg_data/server.log start

# Create the target schema database
psql -U postgres -p 5433 -h localhost -d postgres -c "CREATE DATABASE ecofarm;"
```

### 3. Setup Dependencies & Environments
Initialize workspace packages and install requirements:
```bash
# Install NPM packages
pnpm install

# Build dependencies and verify Prisma client compilation
pnpm run build

# Push database models and generate Prisma client
pnpm --filter @eco-farm/db exec prisma db push --accept-data-loss

# Install python packages
pip install -r apps/agents/requirements.txt
```

### 4. Running the Stack
Launch all processes in watch/dev modes:
```bash
# Start backend API (Port 3000)
pnpm --filter @eco-farm/api run dev

# Start WebMCP server (Port 3001)
pnpm --filter @eco-farm/mcp-server run dev

# Start Next.js PWA Dashboard (Port 3007)
pnpm --filter farmquest-web-dashboard run dev

# Start CRISPR Bioinformatics (Port 3008)
python apps/bioinformatics/src/main.py

# Start LangGraph Agent (Port 8000)
python -m uvicorn apps.agents.src.main:app --host 0.0.0.0 --port 8000
```

---

## 🔒 Security, Trust & Attestations

1. **Post-Quantum Encrypted Enclaves:** WebAuthn hardware biometric key verification combined with CRYSTALS-Dilithium signature signing schemas.
2. **TEE Intel TDX Attestation:** Gateway mappings verify hardware attestation claims with fallback mocks.
3. **Solana Blockchain Ledger:** Multi-sig minting of verified carbon credit tokens simulating both offline and online states.
4. **TimescaleDB Telemetry:** Composite primary keys (`[time, deviceId, metric]`) secure high-velocity IoT telemetry in TimescaleDB hypertable indexes.
