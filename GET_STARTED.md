# 🎯 GET STARTED - Fix Your 404 Errors

## The Issue
Your debug page shows all services returning 404 errors because **they're not running**.

## Solution: Start Services (No Docker Needed!)

### Step 1: Check Prerequisites

You need:
- ✅ Node.js installed
- ✅ PostgreSQL installed (for database)

### Step 2: Quick Start Script

Run this in PowerShell:

```powershell
.\start-services.ps1
```

This opens 3 terminal windows automatically!

### Step 3: Manual Start (If Script Doesn't Work)

Open **3 separate PowerShell windows**:

**Window 1 - User Service:**
```powershell
cd "C:\Users\tejas\OneDrive\Desktop\Eco Farm\services\user-service"
npm install
npm start
```
Wait for: "User Service running on port 3001"

**Window 2 - API Gateway:**
```powershell
cd "C:\Users\tejas\OneDrive\Desktop\Eco Farm\services\api-gateway"
npm install
npm start
```
Wait for: "API Gateway running on port 3000"

**Window 3 - Frontend:**
```powershell
cd "C:\Users\tejas\OneDrive\Desktop\Eco Farm\client\web"
npm install
npm run dev
```
Wait for: "Ready on http://localhost:3001"

### Step 4: Test It Works

1. Visit: http://localhost:3001/debug
2. Click "Run Diagnostic Tests"
3. All should show ✅ green

### Step 5: Login!

1. Go to: http://localhost:3001/login
2. Click **"Create Test Account First"** (purple button)
3. It creates the user and logs you in automatically!

## If Services Still Don't Start

### Check PostgreSQL

PostgreSQL needs to be running. Create database:

1. Open pgAdmin or psql
2. Run:
   ```sql
   CREATE DATABASE ecofarm;
   ```

### Check Ports

Make sure ports 3000 and 3001 aren't in use:

```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

If something is using them, stop it or change ports.

## Test Credentials

- Phone: `+919876543210`
- Password: `test123`

Once services are running, login will work! 🎉


