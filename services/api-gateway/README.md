# API Gateway Service

## Overview
The API Gateway serves as the single entry point for all client requests, handling routing, authentication, rate limiting, and load balancing.

## Features
- Request routing to microservices
- JWT-based authentication
- Rate limiting and DDoS protection
- Request/response caching (Redis)
- Health check endpoints
- Request logging and monitoring

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

## Development

```bash
npm run dev
```

## Environment Variables
See `.env.example` for required environment variables.

## API Routes
- `/health` - Health check (public)
- `/api/v1/users/auth/*` - Authentication endpoints (public)
- `/api/v1/users/*` - User service (protected)
- `/api/v1/gamification/*` - Gamification service (protected)
- `/api/v1/ai/*` - AI service (protected)
- `/api/v1/realtime/*` - Real-time service (protected)
- `/api/v1/content/*` - Content service (protected)
- `/api/v1/integrations/*` - Integration service (protected)


