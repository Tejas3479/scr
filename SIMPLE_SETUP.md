# ✅ SIMPLE SETUP - Get Login Working NOW

## The Problem
Services aren't running because Docker isn't installed. Let's start them manually!

## Solution: 3 Steps to Get Login Working

### Step 1: Install PostgreSQL (if not installed)

1. Download: https://www.postgresql.org/download/windows/
2. Install (remember password)
3. Open pgAdmin or psql

Create database:
```sql
CREATE DATABASE ecofarm;
```

### Step 2: Start Services (2 Terminals)

**Terminal 1 - User Service:**
```powershell
cd "C:\Users\tejas\OneDrive\Desktop\Eco Farm\services\user-service"
npm install
# Create .env file with your PostgreSQL password
npm start
```

**Terminal 2 - API Gateway:**
```powershell
cd "C:\Users\tejas\OneDrive\Desktop\Eco Farm\services\api-gateway"
npm install
npm start
```

**Terminal 3 - Frontend:**
```powershell
cd "C:\Users\tejas\OneDrive\Desktop\Eco Farm\client\web"
npm install
npm run dev
```

### Step 3: Test Login

1. Go to: http://localhost:3001/login
2. Click **"Create Test Account First"** (purple button)
3. Wait for "Test account created! Now logging in..."
4. You should be automatically logged in!

## What You Need Installed

- ✅ Node.js (https://nodejs.org/) 
- ✅ PostgreSQL (https://www.postgresql.org/download/)
- ❌ Docker (NOT needed for this!)

## If You Don't Have PostgreSQL

**Option 1:** Install PostgreSQL (recommended)
- Download from official site
- Takes 5 minutes to install

**Option 2:** Use SQLite (simpler, but need code changes)
- We can modify the code to use SQLite instead
- No installation needed

## Quick Test

After starting services, test:
```powershell
# Test User Service
Invoke-WebRequest http://localhost:3001/health

# Should return: {"status":"healthy",...}
```

Then visit http://localhost:3001/login and click "Create Test Account First"

---

**Need help?** Check which step is failing and let me know!


