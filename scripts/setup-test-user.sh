#!/bin/bash

echo "🔧 Setting up test user for Eco Farm Platform..."
echo ""

# Check if Docker is running
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start PostgreSQL if not running
echo "📦 Checking PostgreSQL..."
if ! docker-compose ps postgres | grep -q "Up"; then
    echo "   Starting PostgreSQL..."
    docker-compose up -d postgres
    echo "   Waiting for PostgreSQL to be ready..."
    sleep 5
fi

# Create users table if it doesn't exist
echo "📋 Creating users table if needed..."
docker exec -i ecofarm-postgres psql -U postgres -d ecofarm <<EOF
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
EOF

# Create test user via registration API
echo "👤 Creating test user..."
response=$(curl -s -X POST http://localhost:3000/api/v1/users/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "password": "test123",
    "name": "Test User",
    "language": "en"
  }')

if echo "$response" | grep -q "token"; then
    echo "✅ Test user created successfully!"
    echo ""
    echo "📝 Test Credentials:"
    echo "   Phone: +919876543210"
    echo "   Password: test123"
elif echo "$response" | grep -q "already registered"; then
    echo "ℹ️  Test user already exists"
    echo ""
    echo "📝 Test Credentials:"
    echo "   Phone: +919876543210"
    echo "   Password: test123"
else
    echo "⚠️  Could not create test user via API"
    echo "   Response: $response"
    echo ""
    echo "💡 Try running the seed script manually:"
    echo "   cd services/user-service && npm run seed"
fi

echo ""
echo "🔍 Testing login..."
login_response=$(curl -s -X POST http://localhost:3000/api/v1/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "password": "test123"
  }')

if echo "$login_response" | grep -q "token"; then
    echo "✅ Login test successful!"
else
    echo "❌ Login test failed"
    echo "   Response: $login_response"
fi

echo ""
echo "✨ Setup complete!"


