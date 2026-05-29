# Quick Start Guide

## Architecture Overview

This platform uses a **microservices architecture** with the following components:

### Core Services
1. **API Gateway** - Entry point for all requests (Node.js)
2. **User Service** - User management & authentication (Node.js + PostgreSQL)
3. **Gamification Service** - Missions, points, badges (Python + MongoDB)
4. **AI Service** - ML models, chatbot, predictions (Python + FastAPI)
5. **Real-time Service** - Live chat, streaming (Node.js + Socket.io)
6. **Content Service** - Multilingual content delivery (Node.js)
7. **Integration Service** - External APIs (Python)

### Data Storage
- **PostgreSQL** - User data, transactions
- **MongoDB** - Missions, community content
- **Redis** - Caching, sessions, leaderboards
- **InfluxDB** - Time-series data (IoT, metrics)

### Infrastructure
- **Docker** - Containerization
- **Kubernetes** - Orchestration
- **Terraform** - Infrastructure as Code
- **Prometheus + Grafana** - Monitoring

## Getting Started

### Option 1: Docker Compose (Local Development)

```bash
# Clone repository
git clone <repo-url>
cd eco-farm-platform

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api-gateway
```

### Option 2: Kubernetes (Production)

```bash
# Create namespace
kubectl apply -f infrastructure/kubernetes/namespace.yaml

# Create secrets
kubectl create secret generic ecofarm-secrets \
  --from-literal=jwt-secret=your-secret \
  --from-literal=db-password=your-password \
  -n ecofarm

# Deploy services
kubectl apply -f infrastructure/kubernetes/
```

## Service URLs (Local)

- API Gateway: http://localhost:3000
- User Service: http://localhost:3001
- Gamification Service: http://localhost:3002
- AI Service: http://localhost:3003
- PostgreSQL: localhost:5432
- MongoDB: localhost:27017
- Redis: localhost:6379

## Testing the API

```bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/v1/users/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+911234567890",
    "password": "test123",
    "name": "Test User",
    "language": "en"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+911234567890",
    "password": "test123"
  }'
```

## Development Workflow

1. **Choose a service** to work on (e.g., `services/user-service`)
2. **Install dependencies**: `npm install` or `pip install -r requirements.txt`
3. **Set environment variables**: Copy `.env.example` to `.env`
4. **Start service**: `npm start` or `python src/main.py`
5. **Make changes** and test locally
6. **Commit and push** to trigger CI/CD

## Key Features Implementation Status

### ✅ Completed
- Architecture documentation
- Service scaffolding
- Docker & Kubernetes configs
- Database schemas
- CI/CD pipelines
- Monitoring setup

### 🚧 In Progress / TODO
- Implement ML models (pest detection, yield prediction)
- Build React Native mobile app
- Implement AR mission system
- Set up blockchain integration
- Deploy to cloud infrastructure

## Next Steps

1. **Set up local development environment**
2. **Implement core business logic** in each service
3. **Train and deploy ML models**
4. **Build client applications** (mobile, web, PWA)
5. **Set up monitoring and alerts**
6. **Deploy to production**

## Documentation

- [Complete Architecture](./ARCHITECTURE.md)
- [API Documentation](../docs/API.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)
- [Security Guidelines](../docs/SECURITY.md)
- [Contributing Guide](../docs/CONTRIBUTING.md)

## Support

For questions or issues, please open an issue on GitHub or contact the development team.


