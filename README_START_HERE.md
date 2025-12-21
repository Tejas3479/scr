# 🚨 START HERE - Your Services Aren't Running!

## The Problem
Your debug page shows 404 errors because **services aren't running**. 

## Quick Fix (Choose One)

### Option 1: Start Services Automatically ⚡

Run this PowerShell script:

```powershell
.\start-services.ps1
```

This will open 3 separate terminal windows, one for each service.

### Option 2: Start Manually (Step by Step)

**1. Install PostgreSQL** (if not installed):
- Download: https://www.postgresql.org/download/windows/
- Install with default settings
- Remember your password

**2. Create Database:**
```sql
-- Open pgAdmin or psql, then run:
CREATE DATABASE ecofarm;
```

**3. Start User Service** (Terminal 1):
```powershell
cd "services\user-service"
npm install
npm start
```
✅ Should show: "User Service running on port 3001"

**4. Start API Gateway** (Terminal 2):
```powershell
cd "services\api-gateway"
npm install
npm start
```
✅ Should show: "API Gateway running on port 3000"

**5. Start Frontend** (Terminal 3):
```powershell
cd "client\web"
npm install
npm run dev
```
✅ Should show: "Ready on http://localhost:3001"

**6. Test Login:**
- Go to: http://localhost:3001/login
- Click **"Create Test Account First"** button
- Login should work!

## Test Credentials

Once services are running:
- **Phone:** +919876543210
- **Password:** test123

## Check If Services Are Running

```powershell
# Test User Service
Invoke-WebRequest http://localhost:3001/health

# Test API Gateway
Invoke-WebRequest http://localhost:3000/health
```

Both should return JSON with "status": "healthy"

## Need Help?

1. Check terminal windows for error messages
2. Make sure PostgreSQL is running
3. Check ports 3000, 3001 aren't already in use
4. Visit http://localhost:3001/debug to run diagnostics

---

**After services start, login will work!** 🎉


