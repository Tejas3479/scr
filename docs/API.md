# API Documentation

## Base URL
- Local: `http://localhost:3000/api/v1`
- Production: `https://api.ecofarm.platform/api/v1`

## Authentication

Most endpoints require authentication via JWT token:

```
Authorization: Bearer <token>
```

## Endpoints

### User Service

#### Register User
```http
POST /users/auth/register
Content-Type: application/json

{
  "phone": "+911234567890",
  "password": "securepassword",
  "name": "John Doe",
  "language": "en"
}
```

#### Login
```http
POST /users/auth/login
Content-Type: application/json

{
  "phone": "+911234567890",
  "password": "securepassword"
}
```

#### Get Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "language": "hi",
  "avatar_url": "https://..."
}
```

### Gamification Service

#### Get Missions
```http
GET /gamification/missions?user_id=<user_id>&language=en
Authorization: Bearer <token>
```

#### Complete Mission
```http
POST /gamification/missions/{mission_id}/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "mission_id": "mission_001",
  "user_id": "user_123",
  "evidence": {
    "image_url": "https://...",
    "notes": "Completed successfully"
  }
}
```

#### Get Leaderboard
```http
GET /gamification/leaderboard?limit=100&offset=0
Authorization: Bearer <token>
```

### AI Service

#### Chat with AI Assistant
```http
POST /ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "How to control aphids?",
  "language": "hi",
  "user_id": "user_123"
}
```

#### Analyze Image
```http
POST /ai/image/analyze
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <image_file>
```

#### Get Recommendations
```http
POST /ai/recommendations
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": "user_123",
  "context": {
    "farm_type": "organic",
    "season": "kharif"
  }
}
```

#### Predict Yield
```http
POST /ai/predict/yield
Authorization: Bearer <token>
Content-Type: application/json

{
  "crop_type": "rice",
  "farm_size": 2.5,
  "location": {
    "latitude": 19.0760,
    "longitude": 72.8777
  }
}
```

## Response Format

### Success Response
```json
{
  "data": { ... },
  "status": "success"
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": "error",
  "code": 400
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP
- Rate limit headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error
- `503` - Service Unavailable


