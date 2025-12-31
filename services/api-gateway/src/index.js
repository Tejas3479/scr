const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
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
// assign request IDs
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  res.setHeader('X-Request-ID', req.id);
  next();
});

// --- Rate Limiting & Slowdown ---
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || String(15 * 60 * 1000), 10),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

const speedLimiter = slowDown({
  windowMs: parseInt(process.env.SLOW_DOWN_WINDOW_MS || String(15 * 60 * 1000), 10),
  delayAfter: parseInt(process.env.SLOW_DOWN_DELAY_AFTER || '50', 10),
  delayMs: parseInt(process.env.SLOW_DOWN_DELAY_MS || '500', 10)
});
app.use('/api/', speedLimiter);

// --- IP blacklist middleware ---
const ipBlacklist = (req, res, next) => {
  const raw = process.env.IP_BLACKLIST || '';
  if (!raw) return next();
  const list = raw.split(',').map(s => s.trim()).filter(Boolean);
  const ip = req.ip || req.connection.remoteAddress;
  if (list.includes(ip)) return res.status(403).json({ error: 'Forbidden' });
  next();
};

// --- JWT Verification Middleware ---
const verifyToken = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || req.headers.Authorization;
    if (!auth || !auth.toString().startsWith('Bearer ')) {
      // allow anonymous if gateway configured to permit public access
      if (process.env.ENFORCE_JWT === 'true') return res.status(401).json({ error: 'Missing Authorization header' });
      req.user = { anonymous: true };
      return next();
    }

    const token = auth.toString().slice('Bearer '.length).trim();

    // Support HS256 with JWT_SECRET or RS256 with JWT_PUBLIC_KEY
    if (process.env.JWT_SECRET) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      return next();
    }

    if (process.env.JWT_PUBLIC_KEY) {
      const pub = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n');
      const payload = jwt.verify(token, pub, { algorithms: ['RS256', 'RS384', 'RS512'] });
      req.user = payload;
      return next();
    }

    // No verification method configured: attach token payload without verification (NOT recommended)
    try {
      const payload = jwt.decode(token);
      req.user = payload || { anonymous: true };
      return next();
    } catch (err) {
      req.user = { anonymous: true };
      return next();
    }
  } catch (err) {
    logger.warn('JWT verification failed', { message: err.message });
    return res.status(401).json({ error: 'Invalid token' });
  }
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
  const middlewares = [];
  middlewares.push(ipBlacklist);
  // add auth when required
  if (requiresAuth) middlewares.push(verifyToken);

  // request transformer middleware
  middlewares.push((req, res, next) => {
    // normalize JSON content-type and trim trailing slashes
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/json') && typeof req.body === 'object') {
      // example transformation: rename `uid` -> `userId` if present
      if (req.body.uid && !req.body.userId) {
        req.body.userId = req.body.uid;
        delete req.body.uid;
      }
    }
    // add gateway meta headers
    res.setHeader('X-Gateway', 'eco-farm');
    next();
  });

  middlewares.push(createProxyMiddleware({
    target,
    changeOrigin: true,
    selfHandleResponse: true,
    pathRewrite: (path, req) => {
      // Map /api/v1/... -> /api/... preserving the rest of the path
      // support host-based versioning: e.g. v2.api.example.com -> map to /api/v2/...
      const host = (req.headers.host || '').toLowerCase();
      if (host.startsWith('v2.') || host.includes('.v2.')) {
        return path.replace(/^\/api\/v1/, '/api/v2');
      }
      return path.replace(/^\/api\/v1/, '/api');
    },
    onProxyReq: (proxyReq, req) => {
      if (req.user) {
        proxyReq.setHeader('X-User-ID', req.user.userId || req.user.id || '');
        proxyReq.setHeader('X-User-Role', req.user.role || '');
      }
      proxyReq.setHeader('X-Request-ID', req.id);
    },
    onProxyRes: async (proxyRes, req, res) => {
      try {
        const chunks = [];
        proxyRes.on('data', chunk => chunks.push(chunk));
        proxyRes.on('end', () => {
          const body = Buffer.concat(chunks);
          const contentType = proxyRes.headers['content-type'] || '';
          // strip sensitive headers
          delete proxyRes.headers['x-powered-by'];
          delete proxyRes.headers['server'];
          // forward headers
          Object.entries(proxyRes.headers).forEach(([k, v]) => res.setHeader(k, v));

          if (contentType.includes('application/json')) {
            try {
              const json = JSON.parse(body.toString('utf8'));
              // remove common internal fields
              if (json && typeof json === 'object') {
                delete json.internal;
                delete json.secret;
              }
              const out = JSON.stringify(json);
              res.status(proxyRes.statusCode).send(out);
            } catch (err) {
              logger.warn('Failed to parse upstream JSON', { message: err.message });
              res.status(proxyRes.statusCode).send(body);
            }
          } else {
            res.status(proxyRes.statusCode).send(body);
          }
        });
      } catch (err) {
        logger.error('onProxyRes error', { message: err.message });
        res.status(502).json({ error: 'Bad Gateway' });
      }
    },
    onError: (err, req, res) => {
      logger.error('Proxy error', { message: err.message, target });
      res.status(503).json({ error: 'Service temporarily unavailable' });
    }
  }));

  return middlewares;
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