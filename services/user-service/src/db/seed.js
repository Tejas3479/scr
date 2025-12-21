const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ecofarm',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
});

async function seedTestUser() {
  try {
    const phone = '+919876543210';
    const password = 'test123';
    const name = 'Test User';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const checkResult = await pool.query(
      'SELECT id FROM users WHERE phone = $1',
      [phone]
    );

    if (checkResult.rows.length > 0) {
      console.log('Test user already exists');
      await pool.end();
      return;
    }

    // Insert test user
    const result = await pool.query(
      `INSERT INTO users (phone, password_hash, name, language, level, points, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, phone, name`,
      [phone, hashedPassword, name, 'en', 5, 1500]
    );

    console.log('✅ Test user created successfully!');
    console.log('Phone:', phone);
    console.log('Password:', password);
    console.log('Name:', result.rows[0].name);
    console.log('ID:', result.rows[0].id);
    
    await pool.end();
  } catch (error) {
    console.error('Error seeding test user:', error);
    await pool.end();
    process.exit(1);
  }
}

seedTestUser();


