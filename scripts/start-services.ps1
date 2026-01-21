# PowerShell script to start all services

Write-Host "🚀 Starting Eco Farm Platform Services..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Navigate to project root
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Stop any existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose down 2>$null

# Start services
Write-Host "📦 Starting services with Docker Compose..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services to start
Write-Host "⏳ Waiting for services to initialize (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check service status
Write-Host ""
Write-Host "📊 Service Status:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "🔍 Testing service health..." -ForegroundColor Yellow

# Test API Gateway
try {
    $gatewayResponse = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 5
    if ($gatewayResponse.StatusCode -eq 200) {
        Write-Host "✅ API Gateway is healthy" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  API Gateway not responding yet" -ForegroundColor Yellow
}

# Test User Service
try {
    $userServiceResponse = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 5
    if ($userServiceResponse.StatusCode -eq 200) {
        Write-Host "✅ User Service is healthy" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  User Service not responding yet" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Wait a few more seconds for services to fully start"
Write-Host "   2. Visit http://localhost:3001/login"
Write-Host "   3. Click 'Create Test Account First' button"
Write-Host "   4. Or visit http://localhost:3001/debug to run diagnostics"
Write-Host ""
Write-Host "📋 View logs: docker-compose logs -f" -ForegroundColor Gray
Write-Host "🛑 Stop services: docker-compose down" -ForegroundColor Gray




