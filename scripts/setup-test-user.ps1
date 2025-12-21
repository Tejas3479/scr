# PowerShell script to setup test user on Windows

Write-Host "🔧 Setting up test user for Eco Farm Platform..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker ps | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker first." -ForegroundColor Red
    exit 1
}

# Start PostgreSQL if not running
Write-Host "📦 Checking PostgreSQL..." -ForegroundColor Yellow
$postgresStatus = docker-compose ps postgres 2>$null
if (-not ($postgresStatus -match "Up")) {
    Write-Host "   Starting PostgreSQL..." -ForegroundColor Yellow
    docker-compose up -d postgres
    Write-Host "   Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
}

# Create users table
Write-Host "📋 Creating users table if needed..." -ForegroundColor Yellow
docker exec -i ecofarm-postgres psql -U postgres -d ecofarm -c @"
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
"@

# Create test user via registration API
Write-Host "👤 Creating test user..." -ForegroundColor Yellow
$body = @{
    phone = "+919876543210"
    password = "test123"
    name = "Test User"
    language = "en"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/users/auth/register" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Test user created successfully!" -ForegroundColor Green
} catch {
    if ($_.ErrorDetails.Message -match "already registered") {
        Write-Host "ℹ️  Test user already exists" -ForegroundColor Blue
    } else {
        Write-Host "⚠️  Could not create test user via API" -ForegroundColor Yellow
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📝 Test Credentials:" -ForegroundColor Cyan
Write-Host "   Phone: +919876543210" -ForegroundColor White
Write-Host "   Password: test123" -ForegroundColor White

# Test login
Write-Host ""
Write-Host "🔍 Testing login..." -ForegroundColor Yellow
$loginBody = @{
    phone = "+919876543210"
    password = "test123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/users/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "✅ Login test successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Login test failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✨ Setup complete!" -ForegroundColor Green


