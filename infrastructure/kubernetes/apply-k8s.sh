#!/usr/bin/env bash
set -euo pipefail
kubectl apply -f namespace.yaml
kubectl apply -f postgres-deployment.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f user-service-deployment.yaml
kubectl apply -f api-gateway-deployment.yaml
