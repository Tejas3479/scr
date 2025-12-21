# Kubernetes Deployment Guide

## Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured
- Docker registry access

## Setup

1. Create namespace:
```bash
kubectl apply -f namespace.yaml
```

2. Create secrets:
```bash
kubectl create secret generic ecofarm-secrets \
  --from-literal=jwt-secret=your-secret-key \
  --from-literal=db-user=postgres \
  --from-literal=db-password=your-password \
  -n ecofarm
```

3. Deploy databases:
```bash
kubectl apply -f postgres-deployment.yaml
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f redis-deployment.yaml
```

4. Deploy services:
```bash
kubectl apply -f user-service-deployment.yaml
kubectl apply -f api-gateway-deployment.yaml
# ... other services
```

## Scaling

To scale services:
```bash
kubectl scale deployment api-gateway --replicas=5 -n ecofarm
```

## Monitoring

Check pod status:
```bash
kubectl get pods -n ecofarm
```

View logs:
```bash
kubectl logs -f deployment/api-gateway -n ecofarm
```


