const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const router = express.Router();

// Get pool from parent app or create new
function createTestUserRoute(pool) {
  // Create or get test user endpoint
  router.post('/create', async (req, res) => {
    try {
      const testPhone = '+919876543210';
      const testPassword = 'test123';
      const testName = 'Test User';

      // Check if users table exists
      const tableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'users'
        );
      `);

      if (!tableCheck.rows[0].exists) {
        // Create users table
        await pool.query(`
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
        `);
      }

      // Check if test user exists
      const checkResult = await pool.query(
        'SELECT id, phone, name FROM users WHERE phone = $1',
        [testPhone]
      );

      if (checkResult.rows.length > 0) {
        return res.json({
          success: true,
          message: 'Test user already exists',
          user: checkResult.rows[0]
        });
      }

      // Create test user
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const result = await pool.query(
        `INSERT INTO users (phone, password_hash, name, language, level, points, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (phone) DO NOTHING
         RETURNING id, phone, name, level, points`,
        [testPhone, hashedPassword, testName, 'en', 5, 1500]
      );

      if (result.rows.length > 0) {
        res.json({
          success: true,
          message: 'Test user created successfully',
          user: result.rows[0]
        });
      } else {
        res.json({
          success: true,
          message: 'Test user already exists (conflict resolved)'
        });
      }
    } catch (error) {
      console.error('Error creating test user:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.stack
      });
    }
  });

  return router;
}

module.exports = createTestUserRoute;


