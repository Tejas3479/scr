const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

const GATEWAY = process.env.GATEWAY_URL || 'http://localhost:3000';
const SECRET = process.env.DEMO_JWT_SECRET || 'demo-secret';

async function run() {
  // create demo JWT (HS256)
  const token = jwt.sign({ userId: 42, role: 'farmer', name: 'Demo' }, SECRET, { expiresIn: '1h' });
  console.log('Demo JWT:', token);

  // public endpoint example
  try {
    const r1 = await fetch(`${GATEWAY}/api/v1/test-user`);
    console.log('/api/v1/test-user status', r1.status);
    console.log(await r1.text());
  } catch (err) {
    console.error('Error calling public endpoint:', err.message);
  }

  // protected endpoint example
  try {
    const r2 = await fetch(`${GATEWAY}/api/v1/users/profile`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    console.log('/api/v1/users/profile status', r2.status);
    console.log(await r2.text());
  } catch (err) {
    console.error('Error calling protected endpoint:', err.message);
  }
}

run().catch(e => { console.error(e); process.exit(1); });
