# ☸️ Kubernetes Deployment Orchestration — Eco Farm v4.0

This workspace houses the declarative manifest specifications for deploying **Eco Farm v4.0 (Solarpunk Cognitive Agriculture OS)** onto high-availability cloud cluster nodes.

---

## 🏗️ Declared Deployment Components

1. **PostgreSQL & Redis DB:** Configured under `postgres-deployment.yaml`.
2. **NestJS Gateway API:** Port `3000` deployment target.
3. **WebMCP Server:** Port `3001` bridge target.
4. **CRISPR Diagnostics:** Port `3008` (Needleman-Wunsch Python aligner).
5. **LangGraph Edge AI Agent:** Port `8000` (PyTorch LIF-SNN Edge).

---

## ⚡ Deployment Sequence

### 1. Apply Namespace
```bash
kubectl apply -f namespace.yaml
```

### 2. Set Up Environment Secrets
Create cluster-wide database connections and post-quantum keys:
```bash
kubectl create secret generic ecofarm-secrets \
  --from-literal=database-url=postgresql://postgres@localhost:5433/ecofarm \
  --from-literal=solana-rpc-url=https://api.mainnet-beta.solana.com \
  -n ecofarm
```

### 3. Deploy Databases & Services
```bash
kubectl apply -f postgres-deployment.yaml -n ecofarm
kubectl apply -f api-gateway-deployment.yaml -n ecofarm
```
