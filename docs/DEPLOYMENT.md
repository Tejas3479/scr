# Deployment Guide — Eco Farm v3.0

This guide details the deployment options for **Eco Farm v3.0 (Solarpunk Cognitive Agriculture OS)**.

---

## 1. Local Monorepo Deployment (Development)

For local development setup and native execution details, refer to the root documentation:
- 📖 [README.md](../README.md) — Structural mappings, ports, and environment setup.
- 🚀 [QUICK_START.md](../QUICK_START.md) — Step-by-step commands.

### Key local parameters:
- **Port 5433:** User-space PostgreSQL database instance.
- **Port 3000:** NestJS Zero-Trust API gateway.
- **Port 3001:** WebMCP Server.
- **Port 3007:** Next.js PWA Client.
- **Port 3008:** FastAPI CRISPR Bioinformatics.
- **Port 8000:** FastAPI LangGraph Agent.

---

## 2. Containerized Deployment (Production)

### AWS / EKS Deployment Architecture
For high-availability hosting, services are packaged into Docker containers and managed via Kubernetes.

### Docker Image Creation
Dockerfiles are located inside each package directory:
- `apps/api/Dockerfile`
- `apps/mcp-server/Dockerfile`
- `apps/agents/Dockerfile`
- `services/bioinformatics-service/Dockerfile`

### Kubernetes Deployment Step-by-Step
1. **Apply Namespace:**
   ```bash
   kubectl apply -f infrastructure/kubernetes/namespace.yaml
   ```
2. **Apply Database Enclaves (PostgreSQL/Redis):**
   ```bash
   kubectl apply -f infrastructure/kubernetes/postgres-deployment.yaml -n ecofarm
   ```
3. **Deploy Microservices:**
   ```bash
   kubectl apply -f infrastructure/kubernetes/api-gateway-deployment.yaml -n ecofarm
   ```
