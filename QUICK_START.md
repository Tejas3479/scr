# 🚀 QUICK START - Get Services Running

## Your Issue
The debug page shows services aren't running (404 errors, "Failed to fetch"). Let's fix this!

## Solution: Start Services

### Option 1: Use PowerShell Script (Easiest)

1. Open PowerShell in the project folder
2. Run:
   ```powershell
   .\scripts\start-services.ps1
   ```

### Option 2: Manual Docker Commands

Open PowerShell and run:

```powershell
# Navigate to project
cd "C:\Users\tejas\OneDrive\Desktop\Eco Farm"

# Start all services
docker-compose up -d

# Wait 15 seconds
Start-Sleep -Seconds 15

# Check if running
docker-compose ps
```

You should see all services with status "Up".

### Option 3: Start One by One

```powershell
# Start databases first
docker-compose up -d postgres mongodb redis

# Wait 10 seconds
Start-Sleep -Seconds 10

# Start services
docker-compose up -d user-service api-gateway gamification-service ai-service

# Check status
docker-compose ps
```

## Verify Services Are Running

After starting, check:

```powershell
# Check API Gateway
Invoke-WebRequest http://localhost:3000/health

# Check User Service
Invoke-WebRequest http://localhost:3001/health
```

## View Logs

If services don't start, check logs:

```powershell
# All logs
docker-compose logs

# Specific service
docker-compose logs user-service
docker-compose logs api-gateway
```

## Common Issues

### Port Already in Use
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Docker Not Running
- Open Docker Desktop
- Wait for it to fully start
- Try again

### Services Won't Build
```powershell
# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

## After Services Start

1. Wait 15-20 seconds for services to fully initialize
2. Visit: http://localhost:3001/debug
3. Click "Run Diagnostic Tests" - all should be ✅
4. Go to: http://localhost:3001/login
5. Click "Create Test Account First" button
6. Login should work!

## Test Credentials

Once services are running:
- Phone: `+919876543210`
- Password: `test123`




