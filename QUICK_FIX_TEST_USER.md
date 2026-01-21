# Quick Fix: Test User Login Issue

## Immediate Solution

### Step 1: Check Service Status

```bash
# Check if services are running
docker-compose ps

# Check user-service logs
docker-compose logs user-service
```

### Step 2: Access Debug Endpoint

Open your browser or use curl to check test user status:

```
http://localhost:3001/api/debug/test-user
```

Or using curl:
```bash
curl http://localhost:3001/api/debug/test-user
```

This will:
- Check if users table exists
- Check if test user exists
- Create test user if missing
- Show detailed information

### Step 3: Manually Create Test User via Registration

If the automatic creation doesn't work, use the registration endpoint:

```bash
curl -X POST http://localhost:3000/api/v1/users/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "password": "test123",
    "name": "Test User",
    "language": "en"
  }'
```

### Step 4: Test Login Directly

```bash
curl -X POST http://localhost:3000/api/v1/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "password": "test123"
  }'
```

## Complete Reset

If nothing works, reset everything:

```bash
# Stop all services
docker-compose down

# Remove database volumes (WARNING: Deletes all data)
docker-compose down -v

# Restart services
docker-compose up -d

# Wait a few seconds, then check logs
docker-compose logs -f user-service
```

## Common Issues

### Issue 1: Database not connected
**Solution:**
```bash
docker-compose up -d postgres
# Wait 5 seconds
docker-compose restart user-service
```

### Issue 2: Users table doesn't exist
**Solution:** The service now creates it automatically, but you can manually create:
```bash
docker exec -i ecofarm-postgres psql -U postgres -d ecofarm -c "
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
"
```

### Issue 3: API Gateway not routing correctly
**Check:**
```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
```

## Debug Checklist

- [ ] PostgreSQL is running: `docker-compose ps postgres`
- [ ] User service is running: `docker-compose ps user-service`
- [ ] Database connection works: `curl http://localhost:3001/health`
- [ ] Users table exists: Check debug endpoint
- [ ] Test user exists: Check debug endpoint
- [ ] API Gateway routes correctly: `curl http://localhost:3000/api/v1/users/auth/login`

## Still Not Working?

1. Check detailed logs:
   ```bash
   docker-compose logs user-service | grep -i "test\|error\|login"
   ```

2. Verify database directly:
   ```bash
   docker exec -it ecofarm-postgres psql -U postgres -d ecofarm -c "SELECT * FROM users WHERE phone = '+919876543210';"
   ```

3. Create user manually via SQL:
   ```bash
   # Generate password hash first (use Node.js):
   node -e "const bcrypt = require('bcrypt'); bcrypt.hash('test123', 10).then(h => console.log(h));"
   
   # Then insert (replace HASH with output above):
   docker exec -i ecofarm-postgres psql -U postgres -d ecofarm -c "INSERT INTO users (phone, password_hash, name, language, level, points) VALUES ('+919876543210', 'HASH', 'Test User', 'en', 5, 1500) ON CONFLICT (phone) DO NOTHING;"
   ```




