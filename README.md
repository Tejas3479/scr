# 🌾 Eco Farm v3.0 — Solarpunk Cognitive Agriculture OS

Welcome to the production-ready monorepo for the **Eco Farm v3.0** platform, featuring zero-trust biometric authentication, decentralized carbon ledger minting, real-time bioinformatics, and autonomous AI query routing.

---

## 🏗️ Monorepo Structure

Our codebase is organized as a Turborepo-managed `pnpm` workspace structure:

```
eco-farm-monorepo/
├── .github/             # GitHub Actions workflows (Relocated to root for automated CI/CD execution)
├── apps/
│   ├── api/             # NestJS API Gateway (Graceful SIGTERM, Redlock Quorum, Envelope Encryption)
│   ├── mcp-server/      # Express WebMCP Server (search_knowledge, mint_carbon_credit)
│   ├── web/             # farmquest-web-dashboard (Solarpunk particles, synth, CLI Next.js client)
│   ├── agents/          # LangGraph Multi-Agent Engine (FastAPI agent query routing)
│   ├── bioinformatics/  # CRISPR DNA sequence alignment pipeline (FastAPI)
│   └── mobile/          # React Native mobile client (Successfully scoped in workspace renames)
├── packages/
│   └── db/              # Shared database module (Prisma client & migrations)
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
- **CRISPR Diagnostics:** Port `3008` (Cas12/Cas13 sequence alignment APIs)
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

## 🔒 Security & Attestations

1. **Zero-Trust Passkeys:** WebAuthn endpoints verify hardware biometric keys and persist metadata in the PostgreSQL store.
2. **TEE Enclave Proofs:** Gateway maps hardware attestation claims (Intel TDX / AWS Nitro) with development fallbacks.
3. **Solana Blockchain Minting:** Carbon credit tokens are signed and simulated locally when RPC endpoints are offline.
4. **Fault-Tolerant Session Ring:** Authenticates split-token hashes dynamically using the 5-node parallel Redis Master Quorum Ring.
