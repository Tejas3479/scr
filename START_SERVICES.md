# 🚀 How to Start Services

## Quick Start

### Step 1: Start All Services with Docker Compose

```bash
# Make sure you're in the project root directory
cd "C:\Users\tejas\OneDrive\Desktop\Eco Farm"

# Start all services
docker-compose up -d

# Check if services are running
docker-compose ps
```

You should see:
- ✅ ecofarm-postgres (running)
- ✅ ecofarm-mongodb (running)
- ✅ ecofarm-redis (running)
- ✅ ecofarm-api-gateway (running)
- ✅ ecofarm-user-service (running)
- ✅ ecofarm-gamification-service (running)
- ✅ ecofarm-ai-service (running)

### Step 2: Wait for Services to Start

Wait about 10-15 seconds for all services to fully start.

### Step 3: Check Service Health

```bash
# Check API Gateway
curl http://localhost:3000/health

# Check User Service
curl http://localhost:3001/health
```

### Step 4: View Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs user-service
docker-compose logs api-gateway
```

## Troubleshooting

### If Services Won't Start

1. **Check Docker is Running**
   ```bash
   docker --version
   docker ps
   ```

2. **Stop and Restart**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

3. **Rebuild Services**
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

### If Getting Port Already in Use

Stop any services using ports 3000, 3001, 3002, 3003, 5432, 27017, 6379:

```bash
# Windows PowerShell
netstat -ano | findstr :3000
netstat -ano | findstr :5432

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

## Manual Start (Alternative)

If Docker Compose doesn't work, start services manually:

### Terminal 1 - PostgreSQL, MongoDB, Redis
```bash
docker-compose up postgres mongodb redis
```

### Terminal 2 - User Service
```bash
cd services/user-service
npm install
npm start
```

### Terminal 3 - API Gateway
```bash
cd services/api-gateway
npm install
npm start
```

### Terminal 4 - Gamification Service
```bash
cd services/gamification-service
pip install -r requirements.txt
python src/main.py
```

## Verify Everything is Working

After starting, run the debug page again:
http://localhost:3001/debug

All tests should show ✅ success.


