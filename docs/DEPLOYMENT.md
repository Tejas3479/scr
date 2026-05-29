# 🚀 Production Deployment Guide — Eco Farm v4.0

This guide provides complete, step-by-step production deployment instructions for **Eco Farm v4.0 (Solarpunk Cognitive Agriculture OS)**.

---

## 1. Automated CI/CD (GitHub Actions)

Our deployment pipeline is fully automated in [ci-cd.yml](file:///c:/Users/tejas/Downloads/scr/.github/workflows/ci-cd.yml). It executes the following actions on push to the `main` branch:
1. **Workspace Compilation:** Installs packages via `pnpm`, builds code targets, and compiles typescript.
2. **Dockerization:** Packages `apps/api`, `apps/mcp-server`, `apps/agents`, and `apps/bioinformatics` into optimized Docker containers.
3. **Kubernetes Deployment:** Deployments are validated using local/cloud Kubeconfigs. The pipeline auto-detects:
   - **Base64-encoded Kubeconfig:** Automatically decodes base64-encoded credentials.
   - **Plaintext Kubeconfig:** Dynamically handles raw YAML configuration files to prevent deploy-time connection refused errors.

---

## 2. Kubernetes Deployment Architecture

Apply configurations in order using the following sequence:

### Step 1: Create the Namespace
```bash
kubectl apply -f infrastructure/kubernetes/namespace.yaml
```

### Step 2: Set Up Database Enclaves (PostgreSQL, Redis & TimescaleDB)
```bash
kubectl apply -f infrastructure/kubernetes/postgres-deployment.yaml -n ecofarm
```

### Step 3: Deploy Microservices & AI Engines
```bash
# Deploy API Gateway
kubectl apply -f infrastructure/kubernetes/api-gateway-deployment.yaml -n ecofarm

# Deploy MCP Server, Bioinformatics, and Agents
kubectl apply -f infrastructure/kubernetes/mcp-server-deployment.yaml -n ecofarm
kubectl apply -f infrastructure/kubernetes/bioinformatics-deployment.yaml -n ecofarm
kubectl apply -f infrastructure/kubernetes/agents-deployment.yaml -n ecofarm
```

---

## 3. Local Monorepo Deployment

To execute or run the stack locally for development:
- Refer to [README.md](../README.md) for database init, port mappings, and running individual service modules under the `pnpm` workspaces.
