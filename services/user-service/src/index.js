const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const winston = require('winston');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ecofarm',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

// Test database connection
pool.on('connect', () => {
  logger.info('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  logger.error('❌ PostgreSQL connection error:', err);
});

// Redis connection (optional - non-blocking)
let redisClient;
try {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  redisClient.connect().catch(err => {
    logger.warn('⚠️ Redis connection failed (non-critical):', err.message);
  });
} catch (err) {
  logger.warn('⚠️ Redis not available (non-critical):', err.message);
}

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize test user if it doesn't exist
async function ensureTestUser() {
  try {
    logger.info('🔍 Checking for test user...');
    
    // First, check if users table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      logger.warn('⚠️ Users table does not exist. Creating schema...');
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
      logger.info('✅ Users table created');
    }

    const testPhone = '+919876543210';
    const testPassword = 'test123';
    const testName = 'Test User';

    // Check if test user exists
    const checkResult = await pool.query(
      'SELECT id, phone, name FROM users WHERE phone = $1',
      [testPhone]
    );

    if (checkResult.rows.length === 0) {
      logger.info('📝 Creating test user...');
      // Create test user
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const insertResult = await pool.query(
        `INSERT INTO users (phone, password_hash, name, language, level, points, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING id, phone, name`,
        [testPhone, hashedPassword, testName, 'en', 5, 1500]
      );
      logger.info('✅ Test user created successfully:', {
        id: insertResult.rows[0].id,
        phone: insertResult.rows[0].phone,
        name: insertResult.rows[0].name
      });
    } else {
      logger.info('✅ Test user already exists:', checkResult.rows[0]);
    }
  } catch (error) {
    logger.error('❌ Error ensuring test user:', error);
  }
}

// Ensure test user exists on startup (with delay to allow DB connection)
setTimeout(() => {
  ensureTestUser().catch(err => {
    logger.error('Failed to ensure test user on startup:', err);
  });
}, 2000);

// Middleware to extract user ID from headers (set by API Gateway)
const getUserId = (req) => {
  return req.headers['x-user-id'] || req.user?.userId;
};

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'healthy', 
      service: 'user-service',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test user creation endpoint (public)
app.post('/api/test-user/create', async (req, res) => {
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
      logger.info('✅ Users table created');
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
      logger.info('✅ Test user created via API endpoint');
      res.json({
        success: true,
        message: 'Test user created successfully',
        user: result.rows[0]
      });
    } else {
      // User already exists due to conflict
      const existingUser = await pool.query(
        'SELECT id, phone, name FROM users WHERE phone = $1',
        [testPhone]
      );
      res.json({
        success: true,
        message: 'Test user already exists',
        user: existingUser.rows[0]
      });
    }
  } catch (error) {
    logger.error('❌ Error creating test user:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Debug endpoint - Check test user
app.get('/api/debug/test-user', async (req, res) => {
  try {
    const testPhone = '+919876543210';
    
    // Check if users table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      return res.json({
        error: 'Users table does not exist',
        tableExists: false,
        suggestion: 'Create table or run schema.sql'
      });
    }
    
    // Check if test user exists
    const result = await pool.query(
      'SELECT id, phone, name, level, points FROM users WHERE phone = $1',
      [testPhone]
    );
    
    if (result.rows.length === 0) {
      // Try to create it
      await ensureTestUser();
      const retryResult = await pool.query(
        'SELECT id, phone, name, level, points FROM users WHERE phone = $1',
        [testPhone]
      );
      
      return res.json({
        created: retryResult.rows.length > 0,
        user: retryResult.rows[0] || null,
        message: retryResult.rows.length > 0 ? 'Test user created' : 'Failed to create test user'
      });
    }
    
    res.json({
      exists: true,
      user: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message, 
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { phone, password, name, language = 'en' } = req.body;
    
    if (!phone || !password || !name) {
      return res.status(400).json({ error: 'Phone, password, and name are required' });
    }
    
    // Ensure table exists
    try {
      await pool.query('SELECT 1 FROM users LIMIT 1');
    } catch {
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
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const result = await pool.query(
      `INSERT INTO users (phone, password_hash, name, language, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, phone, name, language, created_at`,
      [phone, hashedPassword, name, language]
    );
    
    const user = result.rows[0];
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: 'user' },
      process.env.JWT_SECRET || 'default-secret-change-in-production',
      { expiresIn: '15m' }
    );
    
    logger.info('User registered', { userId: user.id, phone: user.phone });
    
    res.status(201).json({
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        language: user.language
      },
      token
    });
  } catch (error) {
    logger.error('Registration error', error);
    if (error.code === '23505') { // Unique violation
      res.status(409).json({ error: 'Phone number already registered' });
    } else {
      res.status(500).json({ error: 'Registration failed', details: error.message });
    }
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    logger.info('Login attempt', { phone });
    
    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required' });
    }
    
    // Ensure test user exists if test credentials are used
    if (phone === '+919876543210') {
      await ensureTestUser();
    }
    
    const result = await pool.query(
      'SELECT id, phone, password_hash, name, language, level, points FROM users WHERE phone = $1',
      [phone]
    );
    
    if (result.rows.length === 0) {
      logger.warn('Login failed: User not found', { phone });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      logger.warn('Login failed: Invalid password', { phone, userId: user.id });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: 'user' },
      process.env.JWT_SECRET || 'default-secret-change-in-production',
      { expiresIn: '24h' }
    );
    
    // Cache user session (non-blocking)
    if (redisClient) {
      try {
        await redisClient.setEx(`session:${user.id}`, 86400, JSON.stringify(user));
      } catch (redisError) {
        logger.warn('Redis cache failed (non-critical)', redisError.message);
      }
    }
    
    logger.info('Login successful', { userId: user.id, phone: user.phone });
    
    res.json({
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        language: user.language,
        level: user.level || 1,
        points: user.points || 0
      },
      token
    });
  } catch (error) {
    logger.error('Login error', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Get user profile
app.get('/api/profile', async (req, res) => {
  try {
    const userId = getUserId(req);
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const result = await pool.query(
      `SELECT id, phone, name, language, avatar_url, level, points,
              created_at, updated_at
       FROM users WHERE id = $1`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Get profile error', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
app.put('/api/profile', async (req, res) => {
  try {
    const userId = getUserId(req);
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const { name, language, avatar_url } = req.body;
    
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (language) {
      updates.push(`language = $${paramCount++}`);
      values.push(language);
    }
    if (avatar_url) {
      updates.push(`avatar_url = $${paramCount++}`);
      values.push(avatar_url);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updates.push(`updated_at = NOW()`);
    values.push(userId);
    
    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values
    );
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    logger.error('Update profile error', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ==================== ADMIN ENDPOINTS ====================

// Get dashboard statistics
app.get('/api/admin/stats', async (req, res) => {
  try {
    // Get total users
    const totalUsersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(totalUsersResult.rows[0].count);

    // Get active users (users who logged in today)
    let activeUsers = 0;
    try {
      const activeUsersResult = await pool.query(
        `SELECT COUNT(DISTINCT user_id) as count 
         FROM user_sessions 
         WHERE last_sync_at >= CURRENT_DATE`
      );
      activeUsers = parseInt(activeUsersResult.rows[0]?.count || 0);
    } catch (err) {
      // user_sessions table might not exist, that's ok
      logger.warn('user_sessions table not found');
    }

    // Get total points (sum of all user points)
    const totalPointsResult = await pool.query('SELECT COALESCE(SUM(points), 0) as total FROM users');
    const totalPoints = parseInt(totalPointsResult.rows[0].total);

    // Get missions completed (would need integration with gamification service)
    const missionsCompleted = 0;

    res.json({
      totalUsers,
      activeUsers,
      missionsCompleted,
      totalPoints
    });
  } catch (error) {
    logger.error('Get stats error', error);
    res.status(500).json({ error: 'Failed to fetch statistics', details: error.message });
  }
});

// Get all users (admin)
app.get('/api/admin/users', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    
    const result = await pool.query(
      `SELECT id, phone, name, language, level, points, created_at
       FROM users
       ORDER BY points DESC, created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    res.json({
      users: result.rows,
      total: result.rows.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    logger.error('Get users error', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// Get user by ID (admin)
app.get('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT id, phone, name, language, avatar_url, level, points, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Get user error', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user leaderboard data (with names)
app.get('/api/admin/leaderboard/users', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    
    const result = await pool.query(
      `SELECT id, name, phone, level, points, avatar_url
       FROM users
       ORDER BY points DESC, level DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    res.json({
      users: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    logger.error('Get leaderboard users error', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard users' });
  }
});

// Get recent activities
app.get('/api/admin/activities', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const activities = [
      {
        id: '1',
        type: 'mission_completed',
        user: 'Rajesh Kumar',
        description: 'Completed mission: Set Up Composting',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        type: 'level_up',
        user: 'Priya Sharma',
        description: 'Reached level 25',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];
    
    res.json(activities.slice(0, limit));
  } catch (error) {
    logger.error('Get activities error', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

app.listen(PORT, () => {
  logger.info(`🚀 User Service running on port ${PORT}`);
  logger.info(`📝 Test credentials: Phone: +919876543210, Password: test123`);
  logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
});
