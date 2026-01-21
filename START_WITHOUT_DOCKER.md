# 🚀 Start Services WITHOUT Docker

Since Docker isn't installed, let's start services manually with Node.js and Python.

## Prerequisites

1. **Node.js** (v18+) - https://nodejs.org/
2. **Python** (v3.10+) - https://www.python.org/
3. **PostgreSQL** - https://www.postgresql.org/download/windows/
4. **MongoDB** - https://www.mongodb.com/try/download/community
5. **Redis** (optional) - https://github.com/microsoftarchive/redis/releases

## Quick Start (Minimal Setup)

### Step 1: Install PostgreSQL

1. Download: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set (default: `postgres`)

### Step 2: Create Database

Open PostgreSQL command line (pgAdmin or psql):

```sql
CREATE DATABASE ecofarm;
```

### Step 3: Create Users Table

```sql
\c ecofarm

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(15) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
```

### Step 4: Start User Service

Open PowerShell Terminal 1:

```powershell
cd "C:\Users\tejas\OneDrive\Desktop\Eco Farm\services\user-service"
npm install
npm start
```

**Keep this terminal open!** The service should show:
```
✅ Connected to PostgreSQL
🚀 User Service running on port 3001
```

### Step 5: Start API Gateway

Open PowerShell Terminal 2:

```powershell
cd "C:\Users\tejas\OneDrive\Desktop\Eco Farm\services\api-gateway"
npm install
npm start
```

**Keep this terminal open!** Should show:
```
API Gateway running on port 3000
```

### Step 6: Start Frontend

Open PowerShell Terminal 3:

```powershell
cd "C:\Users\tejas\OneDrive\Desktop\Eco Farm\client\web"
npm install
npm run dev
```

## Test It

1. Visit: http://localhost:3001/login
2. Click "Create Test Account First" button
3. It will create the test user and log you in!

## Environment Variables

Create `.env` files in each service:

**services/user-service/.env:**
```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecofarm
DB_USER=postgres
DB_PASSWORD=your-postgres-password
JWT_SECRET=test-secret-key
```

**services/api-gateway/.env:**
```
PORT=3000
JWT_SECRET=test-secret-key
REDIS_URL=redis://localhost:6379
USER_SERVICE_URL=http://localhost:3001
```

## Minimal Setup (Just User Service + API Gateway)

For testing login, you only need:
- ✅ PostgreSQL
- ✅ User Service (port 3001)
- ✅ API Gateway (port 3000)
- ✅ Frontend (port 3001 - Next.js default)

MongoDB, Redis, and other services are optional for basic login testing.




