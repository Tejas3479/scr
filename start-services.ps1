# Start Services Without Docker
# Run this script to start all services manually

Write-Host "🚀 Starting Eco Farm Platform Services (Without Docker)" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

Write-Host ""
Write-Host "📝 Instructions:" -ForegroundColor Yellow
Write-Host ""
Write-Host "You need to start services in SEPARATE terminal windows:" -ForegroundColor White
Write-Host ""
Write-Host "TERMINAL 1 - PostgreSQL:" -ForegroundColor Cyan
Write-Host "  Make sure PostgreSQL is running and database 'ecofarm' exists"
Write-Host ""
Write-Host "TERMINAL 2 - User Service:" -ForegroundColor Cyan
Write-Host "  cd services\user-service"
Write-Host "  npm install"
Write-Host "  npm start"
Write-Host ""
Write-Host "TERMINAL 3 - API Gateway:" -ForegroundColor Cyan
Write-Host "  cd services\api-gateway"
Write-Host "  npm install"
Write-Host "  npm start"
Write-Host ""
Write-Host "TERMINAL 4 - Frontend:" -ForegroundColor Cyan
Write-Host "  cd client\web"
Write-Host "  npm install"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Press Enter to open User Service terminal..." -ForegroundColor Yellow
Read-Host

# Start User Service in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\services\user-service'; Write-Host 'Starting User Service...' -ForegroundColor Green; npm install; npm start"

Write-Host ""
Write-Host "User Service terminal opened. Press Enter to open API Gateway terminal..." -ForegroundColor Yellow
Read-Host

# Start API Gateway in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\services\api-gateway'; Write-Host 'Starting API Gateway...' -ForegroundColor Green; npm install; npm start"

Write-Host ""
Write-Host "API Gateway terminal opened. Press Enter to open Frontend terminal..." -ForegroundColor Yellow
Read-Host

# Start Frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\client\web'; Write-Host 'Starting Frontend...' -ForegroundColor Green; npm install; npm run dev"

Write-Host ""
Write-Host "✅ All terminals opened!" -ForegroundColor Green
Write-Host ""
Write-Host "⏳ Wait 30 seconds for services to start, then:" -ForegroundColor Yellow
Write-Host "   1. Visit: http://localhost:3001/login" -ForegroundColor White
Write-Host "   2. Click 'Create Test Account First' button" -ForegroundColor White
Write-Host "   3. Login should work!" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter to exit..." -ForegroundColor Gray
Read-Host


