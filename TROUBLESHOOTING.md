# Troubleshooting Guide

## Login Failed - Test Account Issues

If you're getting "Login failed. Please check your credentials" with the test account, follow these steps:

### Step 1: Check Database Connection

Make sure PostgreSQL is running:

```bash
# Check if PostgreSQL is running (Docker)
docker-compose ps postgres

# Or check directly
psql -U postgres -d ecofarm -c "SELECT COUNT(*) FROM users;"
```

### Step 2: Ensure Database Schema Exists

Run the schema creation script:

```bash
# Using psql
psql -U postgres -d ecofarm -f services/user-service/src/db/schema.sql

# Or if using Docker
docker exec -i ecofarm-postgres psql -U postgres -d ecofarm < services/user-service/src/db/schema.sql
```

### Step 3: Create Test User

The service now automatically creates the test user on startup. However, if it doesn't work:

**Option A: Run Seed Script**
```bash
cd services/user-service
npm install  # Make sure bcrypt is installed
npm run seed
```

**Option B: Manual SQL Insert**
```sql
-- First, you need to generate the password hash
-- Use Node.js:
-- const bcrypt = require('bcrypt');
-- bcrypt.hash('test123', 10).then(console.log);

-- Then insert (replace <hash> with actual hash):
INSERT INTO users (phone, password_hash, name, language, level, points, created_at)
VALUES ('+919876543210', '$2b$10$YourHashHere', 'Test User', 'en', 5, 1500, NOW())
ON CONFLICT (phone) DO NOTHING;
```

**Option C: Use Registration API**
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

### Step 4: Check Service Logs

Check if the user service is running and see error logs:

```bash
# Docker logs
docker-compose logs user-service

# Or if running directly
cd services/user-service
npm start
# Check console for errors
```

### Step 5: Verify Test User Exists

Check if test user was created:

```sql
SELECT id, phone, name, level, points FROM users WHERE phone = '+919876543210';
```

### Step 6: Test Login Directly

Test the login endpoint directly:

```bash
curl -X POST http://localhost:3000/api/v1/users/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "password": "test123"
  }'
```

Expected response:
```json
{
  "user": {
    "id": 1,
    "phone": "+919876543210",
    "name": "Test User",
    ...
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Common Issues

#### Issue: "relation users does not exist"
**Solution:** Run the database schema script (Step 2)

#### Issue: "password authentication failed"
**Solution:** Check PostgreSQL credentials in `.env` file

#### Issue: "Connection refused"
**Solution:** 
- Check if PostgreSQL container is running: `docker-compose ps`
- Check port 5432 is not blocked
- Verify connection string in `.env`

#### Issue: Redis connection errors
**Solution:** Redis errors are non-fatal - login will still work. Check Redis:
```bash
docker-compose ps redis
```

#### Issue: JWT_SECRET not set
**Solution:** The service uses a default secret in development, but set it in production:
```bash
# In .env file
JWT_SECRET=your-secret-key-here
```

### Quick Fix Script

Create and run this script to set everything up:

```bash
#!/bin/bash
# setup-test-user.sh

echo "Setting up test user..."

# Start services
docker-compose up -d postgres redis

# Wait for PostgreSQL
sleep 5

# Create schema
docker exec -i ecofarm-postgres psql -U postgres -d ecofarm < services/user-service/src/db/schema.sql

# Create test user
cd services/user-service
npm run seed

echo "Test user setup complete!"
echo "Credentials: Phone: +919876543210, Password: test123"
```

### Still Having Issues?

1. Check all services are running:
   ```bash
   docker-compose ps
   ```

2. Check API Gateway is routing correctly:
   ```bash
   curl http://localhost:3000/health
   ```

3. Check User Service health:
   ```bash
   curl http://localhost:3001/health
   ```

4. View detailed logs:
   ```bash
   docker-compose logs -f user-service api-gateway
   ```




