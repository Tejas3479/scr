# 🔧 Manual Service Start Guide

## Problem
Services are not running, causing 404 errors. Let's start them manually!

## Step-by-Step Solution

### Step 1: Check Docker

Open PowerShell and check if Docker is installed:

```powershell
docker --version
```

If not installed:
1. Download Docker Desktop: https://www.docker.com/products/docker-desktop
2. Install and restart your computer
3. Open Docker Desktop and wait for it to start

### Step 2: Start Services

Try these commands in order:

**Option A: New Docker Compose (V2)**
```powershell
cd "C:\Users\tejas\OneDrive\Desktop\Eco Farm"
docker compose up -d
```

**Option B: Old Docker Compose (V1)**
```powershell
cd "C:\Users\tejas\OneDrive\Desktop\Eco Farm"
docker-compose up -d
```

**Option C: If Docker Compose not found**
```powershell
# Install Docker Compose
# Or use Docker Desktop which includes it
```

### Step 3: Verify Services Started

```powershell
# Check status
docker ps

# Should show containers:
# - ecofarm-postgres
# - ecofarm-mongodb  
# - ecofarm-redis
# - ecofarm-api-gateway
# - ecofarm-user-service
# etc.
```

### Step 4: Wait for Services

Wait 20-30 seconds for services to fully start, then test:

```powershell
# Test API Gateway
curl http://localhost:3000/health

# Test User Service  
curl http://localhost:3001/health
```

## Alternative: Start Services Manually

If Docker Compose doesn't work, start services individually:

### Terminal 1: Databases
```powershell
docker run -d --name ecofarm-postgres -p 5432:5432 -e POSTGRES_DB=ecofarm -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres postgres:15-alpine
docker run -d --name ecofarm-mongodb -p 27017:27017 mongo:7.0
docker run -d --name ecofarm-redis -p 6379:6379 redis:7-alpine
```

### Terminal 2: User Service
```powershell
cd "C:\Users\tejas\OneDrive\Desktop\Eco Farm\services\user-service"
npm install
npm start
```

### Terminal 3: API Gateway
```powershell
cd "C:\Users\tejas\OneDrive\Desktop\Eco Farm\services\api-gateway"
npm install
npm start
```

## Quick Test

After starting, visit:
- http://localhost:3001/debug - Run diagnostics
- http://localhost:3001/login - Login page

## Still Not Working?

1. **Check Docker Desktop is running**
   - Look for Docker icon in system tray
   - Right-click → Start Docker Desktop

2. **Check ports aren't in use**
   ```powershell
   netstat -ano | findstr :3000
   netstat -ano | findstr :3001
   netstat -ano | findstr :5432
   ```

3. **Try restarting Docker**
   - Right-click Docker icon → Restart
   - Wait 1 minute
   - Try docker-compose again

4. **Check firewall**
   - Windows Firewall might be blocking Docker
   - Temporarily disable to test




