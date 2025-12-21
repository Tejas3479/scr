-- Seed script to create a test user for quick login
-- This creates a test user with credentials:
-- Phone: +919876543210
-- Password: test123

-- Note: Password hash needs to be generated. Run the seed.js script instead:
-- node services/user-service/src/db/seed.js

-- Or manually create user (you'll need to generate the hash):
-- INSERT INTO users (phone, password_hash, name, language, level, points, created_at)
-- VALUES ('+919876543210', '<bcrypt_hash_of_test123>', 'Test User', 'en', 5, 1500, NOW());

-- To generate hash, use bcrypt.hash('test123', 10) in Node.js


