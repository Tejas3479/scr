# Test Credentials for Eco Farm Platform

## Quick Login Credentials

Use these credentials to quickly test the platform without creating a new account:

```
Phone: +919876543210
Password: test123
```

## Setup Test User

### Option 1: Run Seed Script (Recommended)

```bash
cd services/user-service
npm run seed
```

This will automatically create the test user in the database with:
- Phone: `+919876543210`
- Password: `test123`
- Name: `Test User`
- Level: 5
- Points: 1500

### Option 2: Manual Setup via SQL

First, generate the password hash (you'll need Node.js):

```javascript
const bcrypt = require('bcrypt');
bcrypt.hash('test123', 10).then(hash => console.log(hash));
```

Then insert into database:

```sql
INSERT INTO users (phone, password_hash, name, language, level, points, created_at)
VALUES ('+919876543210', '<generated_hash>', 'Test User', 'en', 5, 1500, NOW());
```

## Using Test Credentials

1. Go to the login page: http://localhost:3001/login
2. Click the **"Use Test Account"** button (blue button below the form)
3. The credentials will be auto-filled
4. Click **"Sign In"** to login

Or manually enter:
- Phone: `+919876543210`
- Password: `test123`

## Features Available with Test Account

Once logged in with the test account, you can:
- ✅ View dashboard statistics
- ✅ See active missions
- ✅ Check leaderboard
- ✅ View achievements
- ✅ Access all platform features

## Creating Additional Test Users

You can create more test users using the registration form:

1. Click "Create Account" on the login page
2. Fill in the form with any test data
3. Use any phone number (just ensure it's unique)

---

**Note:** The test user is created for development/testing purposes only. For production, ensure test accounts are removed or secured.


