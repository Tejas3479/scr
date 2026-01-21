/**
 * Rate Limiting Middleware for API Gateway
 * Provides request throttling and DDoS protection
 */

const rateLimit = (options: {
  windowMs?: number
  maxRequests?: number
  message?: string
  keyGenerator?: (req: any) => string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
} = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000 // 15 minutes default
  const maxRequests = options.maxRequests || 100
  const message = options.message || 'Too many requests, please try again later.'
  const skipSuccessfulRequests = options.skipSuccessfulRequests || false
  const skipFailedRequests = options.skipFailedRequests || false

  // In-memory store (for development/testing)
  // In production, use Redis: const store = new RedisStore({ client: redisClient })
  const store = new Map<string, Array<number>>()

  const keyGenerator = options.keyGenerator || ((req: any) => {
    return req.ip || req.connection.remoteAddress
  })

  // Cleanup expired entries periodically
  setInterval(() => {
    const now = Date.now()
    for (const [key, timestamps] of store.entries()) {
      const valid = timestamps.filter(t => now - t < windowMs)
      if (valid.length === 0) {
        store.delete(key)
      } else {
        store.set(key, valid)
      }
    }
  }, windowMs)

  return (req: any, res: any, next: any) => {
    const key = keyGenerator(req)
    const now = Date.now()
    const timestamps = store.get(key) || []

    // Remove expired timestamps
    const validTimestamps = timestamps.filter(t => now - t < windowMs)

    if (validTimestamps.length >= maxRequests) {
      // Rate limit exceeded
      if (skipFailedRequests) {
        return next()
      }

      return res.status(429).json({
        success: false,
        error: 'TOO_MANY_REQUESTS',
        message,
        retryAfter: Math.ceil(windowMs / 1000),
      })
    }

    // Store request timestamp
    validTimestamps.push(now)
    store.set(key, validTimestamps)

    // Add rate limit headers
    const remaining = maxRequests - validTimestamps.length
    res.set({
      'X-RateLimit-Limit': String(maxRequests),
      'X-RateLimit-Remaining': String(Math.max(0, remaining)),
      'X-RateLimit-Reset': String(new Date(now + windowMs).getTime()),
    })

    // Hook into response to skip if needed
    if (skipSuccessfulRequests) {
      const originalJson = res.json
      res.json = function(body: any) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Remove this request from rate limit on successful response
          const timestamps = store.get(key) || []
          if (timestamps.length > 0) {
            timestamps.pop()
          }
        }
        return originalJson.call(this, body)
      }
    }

    next()
  }
}

/**
 * Auth Route Rate Limiting
 * More restrictive limits for login/register routes
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts
  message: 'Too many authentication attempts. Please try again later.',
})

/**
 * General API Rate Limiting
 * Standard limits for regular API routes
 */
export const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
  message: 'API rate limit exceeded. Please slow down.',
})

/**
 * Strict Rate Limiting
 * For sensitive operations like data exports
 */
export const strictRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
  message: 'Rate limit exceeded for this sensitive operation.',
})

/**
 * DDoS Protection Headers Middleware
 */
export const ddosProtection = (req: any, res: any, next: any) => {
  // Add security headers for DDoS protection
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'",
  })

  // Limit request size to prevent large payloads
  if (req.get('Content-Length') > 1024 * 1024) {
    // 1MB limit
    return res.status(413).json({
      success: false,
      error: 'PAYLOAD_TOO_LARGE',
      message: 'Request payload exceeds maximum size.',
    })
  }

  next()
}

/**
 * Request Validation Middleware
 * Additional protection against malformed requests
 */
export const requestValidation = (req: any, res: any, next: any) => {
  // Validate Content-Type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type')

    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_CONTENT_TYPE',
        message: 'Content-Type must be application/json.',
      })
    }
  }

  // Validate JSON parsing
  if (req.body === undefined && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_JSON',
      message: 'Request body must be valid JSON.',
    })
  }

  next()
}

/**
 * Usage Example in API Gateway:
 *
 * import { authRateLimit, apiRateLimit, ddosProtection, requestValidation } from './middleware/rateLimiting'
 *
 * app.use(ddosProtection)
 * app.use(requestValidation)
 *
 * // Auth routes with stricter limits
 * app.post('/api/v1/users/auth/login', authRateLimit, handleLogin)
 * app.post('/api/v1/users/auth/register', authRateLimit, handleRegister)
 * app.post('/api/v1/users/auth/refresh', authRateLimit, handleRefresh)
 *
 * // General API routes
 * app.use('/api/v1/', apiRateLimit)
 *
 * // Sensitive routes
 * app.post('/api/v1/data/export', strictRateLimit, handleExport)
 */

export default { authRateLimit, apiRateLimit, strictRateLimit, ddosProtection, requestValidation }
