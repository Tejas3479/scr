const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const winston = require('winston');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Logger Setup ---
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// --- Redis Client (Disabled) ---
// Kept as a mock to prevent ReferenceErrors if extended later, 
// but strictly not used by the new verifyToken.
const redisClient = {
  get: async () => null,
  set: async () => true,
  setEx: async () => true,
  isReady: false,
  connect: async () => { console.log('Redis disabled.'); }
};

// --- Global Middleware ---
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// --- JWT Verification Middleware (Disabled) ---
const verifyToken = async (req, res, next) => {
  // No authentication required - set default user
  req.user = {
    id: 1,
    phone: '+919876543210',
    name: 'Demo User',
    role: 'user'
  };
  return next();
};

// --- Service Config ---
const services = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  gamification: process.env.GAMIFICATION_SERVICE_URL || 'http://localhost:3002',
  ai: process.env.AI_SERVICE_URL || 'http://localhost:3003',
  realtime: process.env.REALTIME_SERVICE_URL || 'http://localhost:3004',
  content: process.env.CONTENT_SERVICE_URL || 'http://localhost:3005',
  integration: process.env.INTEGRATION_SERVICE_URL || 'http://localhost:3006'
};

// --- Proxy Factory ---
const createServiceProxy = (target, pathPattern, requiresAuth = true) => {
  return [
    ...(requiresAuth ? [verifyToken] : []),
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^/api/v1/${pathPattern}`]: '/api' },
      onProxyReq: (proxyReq, req) => {
        if (req.user) {
          proxyReq.setHeader('X-User-ID', req.user.userId || '');
          proxyReq.setHeader('X-User-Role', req.user.role || '');
        }
      },
      onError: (err, req, res) => {
        logger.error('Proxy error', { message: err.message, target });
        res.status(503).json({ error: 'Service temporarily unavailable' });
      }
    })
  ];
};

// --- Routes ---
app.get('/health', (req, res) => res.json({ status: 'UP', timestamp: new Date() }));

// Public
app.use('/api/v1/users/auth', createServiceProxy(services.user, 'users/auth', false));
app.use('/api/v1/test-user', createServiceProxy(services.user, 'test-user', false));

// Protected
app.use('/api/v1/users', createServiceProxy(services.user, 'users'));
app.use('/api/v1/ai', createServiceProxy(services.ai, 'ai'));
app.use('/api/v1/gamification', createServiceProxy(services.gamification, 'gamification'));
app.use('/api/v1/content', createServiceProxy(services.content, 'content'));
app.use('/api/v1/integrations', createServiceProxy(services.integration, 'integrations'));

// Error Handler
app.use((err, req, res, next) => {
  logger.error('Global error', { stack: err.stack });
  res.status(500).json({ error: 'Internal gateway error' });
});

app.listen(PORT, () => logger.info(`🚀 API Gateway active on port ${PORT}`));