# System Architecture Diagrams

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Mobile    │  │     Web     │  │     PWA     │            │
│  │     App     │  │  Dashboard  │  │             │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                 │                 │                   │
│         └─────────────────┼─────────────────┘                   │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                       API GATEWAY LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Kong / AWS API Gateway                                   │   │
│  │  - Authentication & Authorization                         │   │
│  │  - Rate Limiting                                          │   │
│  │  - Request Routing                                        │   │
│  │  - Load Balancing                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   USER        │  │ GAMIFICATION  │  │      AI       │
│   SERVICE     │  │    SERVICE    │  │   SERVICE     │
└───────────────┘  └───────────────┘  └───────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   REALTIME    │  │   CONTENT     │  │ INTEGRATION   │
│   SERVICE     │  │   SERVICE     │  │   SERVICE     │
└───────────────┘  └───────────────┘  └───────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │PostgreSQL│  │ MongoDB  │  │  Redis   │  │ InfluxDB │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow for Mission Completion

```
User (Mobile App)
    │
    ▼
API Gateway (JWT validation)
    │
    ▼
Gamification Service
    │
    ├──► Validate mission requirements
    ├──► AI Service (image verification)
    │       │
    │       ▼
    │   Computer Vision Model
    │       │
    │       ▼
    │   Verification Result
    │
    ▼
Update MongoDB (mission state)
    │
    ▼
Award Points/Badges
    │
    ├──► Update Redis (leaderboard)
    ├──► Update PostgreSQL (user points)
    └──► Send Notification (Real-time Service)
            │
            ▼
        Push Notification to User
```

## AI/ML Pipeline

```
Training Data
    │
    ▼
Data Preprocessing
    │
    ▼
Feature Engineering
    │
    ▼
Model Training (TensorFlow/PyTorch)
    │
    ├──► Pest Detection Model
    ├──► Yield Prediction Model
    ├──► NLP Chatbot Model
    └──► Recommendation Model
    │
    ▼
Model Registry (MLflow)
    │
    ▼
Model Serving
    │
    ├──► TensorFlow Serving (Server)
    ├──► TensorFlow Lite (Mobile)
    └──► ONNX Runtime (Edge)
    │
    ▼
API Endpoints
    │
    ▼
Production Inference
```

## Deployment Architecture (Kubernetes)

```
┌─────────────────────────────────────────────────────────────┐
│                    KUBERNETES CLUSTER                       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Load Balancer (Nginx)                   │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                   │
│         ┌───────────────┼───────────────┐                  │
│         │               │               │                   │
│  ┌──────▼──────┐  ┌─────▼──────┐  ┌─────▼──────┐         │
│  │   API       │  │   API      │  │   API      │         │
│  │  Gateway    │  │  Gateway   │  │  Gateway   │         │
│  │  Pod 1      │  │  Pod 2     │  │  Pod 3     │         │
│  └─────────────┘  └────────────┘  └────────────┘         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Service Mesh (Istio)                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐        │
│  │User  │  │Gamif │  │ AI   │  │Real- │  │Content│        │
│  │Svc   │  │Svc   │  │ Svc  │  │time  │  │ Svc   │        │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘        │
│                                                             │
│  ┌──────┐  ┌──────┐  ┌──────┐                             │
│  │Post- │  │Mongo │  │Redis │                             │
│  │gres  │  │ DB   │  │      │                             │
│  └──────┘  └──────┘  └──────┘                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Offline-First Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile Device                             │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Native App                        │  │
│  │                                                      │  │
│  │  ┌──────────────┐  ┌──────────────┐                │  │
│  │  │   Redux      │  │  SQLite      │                │  │
│  │  │   Store      │  │  (Offline)   │                │  │
│  │  └──────────────┘  └──────────────┘                │  │
│  │                                                      │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │      Action Queue (Redux Offline)            │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         │ Online                            │
│                         ▼                                   │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   API Gateway        │
              └──────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Sync Service       │
              │   - Process queue    │
              │   - Resolve conflicts│
              └──────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                          │
│                                                             │
│  1. Network Layer                                           │
│     └─► VPC, Security Groups, WAF                          │
│                                                             │
│  2. Transport Layer                                         │
│     └─► TLS 1.3, Certificate Management                    │
│                                                             │
│  3. Application Layer                                       │
│     └─► OAuth 2.0, JWT, RBAC                               │
│                                                             │
│  4. Data Layer                                              │
│     └─► Encryption at Rest (AES-256)                       │
│     └─► Field-level Encryption                             │
│                                                             │
│  5. Monitoring Layer                                        │
│     └─► Audit Logs, Intrusion Detection                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```


