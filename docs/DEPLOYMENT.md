# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- Kubernetes cluster (for production)
- kubectl configured
- Access to container registry

## Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd eco-farm-platform
```

2. Copy environment files:
```bash
cp services/api-gateway/.env.example services/api-gateway/.env
# Repeat for other services
```

3. Start services with Docker Compose:
```bash
docker-compose up -d
```

4. Verify services:
```bash
docker-compose ps
curl http://localhost:3000/health
```

## Production Deployment

### Using Kubernetes

1. Create namespace:
```bash
kubectl apply -f infrastructure/kubernetes/namespace.yaml
```

2. Create secrets:
```bash
kubectl create secret generic ecofarm-secrets \
  --from-literal=jwt-secret=<your-secret> \
  --from-literal=db-user=postgres \
  --from-literal=db-password=<your-password> \
  -n ecofarm
```

3. Deploy infrastructure:
```bash
kubectl apply -f infrastructure/kubernetes/postgres-deployment.yaml
kubectl apply -f infrastructure/kubernetes/mongodb-deployment.yaml
kubectl apply -f infrastructure/kubernetes/redis-deployment.yaml
```

4. Deploy services:
```bash
kubectl apply -f infrastructure/kubernetes/user-service-deployment.yaml
kubectl apply -f infrastructure/kubernetes/api-gateway-deployment.yaml
```

5. Check deployment status:
```bash
kubectl get pods -n ecofarm
kubectl get services -n ecofarm
```

### Using Terraform (AWS)

1. Initialize Terraform:
```bash
cd infrastructure/terraform
terraform init
```

2. Plan deployment:
```bash
terraform plan
```

3. Apply configuration:
```bash
terraform apply
```

## Monitoring

- Application logs: `kubectl logs -f deployment/<service-name> -n ecofarm`
- Metrics: Access Grafana dashboard (if configured)
- Health checks: `curl http://<service-url>/health`

## Scaling

Scale services horizontally:
```bash
kubectl scale deployment api-gateway --replicas=5 -n ecofarm
```

## Rollback

Rollback to previous version:
```bash
kubectl rollout undo deployment/<service-name> -n ecofarm
```


