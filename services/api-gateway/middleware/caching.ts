/**
 * Caching Middleware for API Gateway
 * Implements request/response caching with Redis for performance
 */

export interface CacheConfig {
  ttl?: number // Time to live in seconds (default: 300)
  key?: string // Custom cache key
  condition?: (req: any) => boolean // Custom condition to cache
  exclude?: string[] // Routes/methods to exclude from caching
}

/**
 * In-memory cache implementation (for development)
 * In production, use Redis for distributed caching
 */
class CacheStore {
  private cache = new Map<string, { data: any; expires: number }>()

  set(key: string, data: any, ttl: number = 300) {
    const expires = Date.now() + ttl * 1000
    this.cache.set(key, { data, expires })

    // Auto-cleanup on set
    setTimeout(() => {
      this.cache.delete(key)
    }, ttl * 1000)
  }

  get(key: string) {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    if (Date.now() > entry.expires) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  delete(key: string) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, val]) => ({
        key,
        expiresIn: Math.max(0, Math.ceil((val.expires - Date.now()) / 1000)),
      })),
    }
  }
}

const cacheStore = new CacheStore()

/**
 * Generate cache key from request
 */
const generateCacheKey = (req: any, customKey?: string): string => {
  if (customKey) {
    return customKey
  }

  const method = req.method
  const path = req.originalUrl || req.url
  const userId = req.user?.id || 'anonymous'

  return `${method}:${path}:${userId}`
}

/**
 * Cache Middleware
 * Caches GET requests and serves cached responses
 */
export const cache = (options: CacheConfig = {}) => {
  const ttl = options.ttl || 300
  const excludedRoutes = options.exclude || ['/api/v1/users/auth/']

  return (req: any, res: any, next: any) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next()
    }

    // Check if route is excluded
    if (excludedRoutes.some(route => req.originalUrl.startsWith(route))) {
      return next()
    }

    // Check custom condition
    if (options.condition && !options.condition(req)) {
      return next()
    }

    const cacheKey = generateCacheKey(req, options.key)

    // Try to serve from cache
    const cachedData = cacheStore.get(cacheKey)
    if (cachedData) {
      console.log(`✓ Cache HIT: ${cacheKey}`)
      res.set('X-Cache', 'HIT')
      res.set('X-Cache-Key', cacheKey)
      return res.json(cachedData)
    }

    // Mark cache as miss
    res.set('X-Cache', 'MISS')
    res.set('X-Cache-Key', cacheKey)

    // Intercept response.json()
    const originalJson = res.json

    res.json = function(data: any) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Cache successful responses
        cacheStore.set(cacheKey, data, ttl)
        console.log(`✓ Cache SET: ${cacheKey} (TTL: ${ttl}s)`)
      }

      return originalJson.call(this, data)
    }

    next()
  }
}

/**
 * Conditional cache middleware with custom strategies
 */
export const conditionalCache = (options: {
  strategies: Record<string, CacheConfig>
} = { strategies: {} }) => {
  return (req: any, res: any, next: any) => {
    // Find matching strategy
    const strategy = Object.entries(options.strategies).find(([pattern]) => {
      const regex = new RegExp(pattern)
      return regex.test(req.originalUrl)
    })

    if (strategy) {
      const [, config] = strategy
      return cache(config)(req, res, next)
    }

    next()
  }
}

/**
 * Cache invalidation endpoint
 * Use to clear cache when data changes
 */
export const invalidateCache = (keys?: string[]) => {
  return (req: any, res: any, next: any) => {
    if (keys) {
      keys.forEach(key => cacheStore.delete(key))
    } else {
      cacheStore.clear()
    }

    res.json({
      success: true,
      message: 'Cache invalidated',
      keysCleared: keys?.length || 'all',
    })
  }
}

/**
 * Cache statistics endpoint
 * Monitor cache performance
 */
export const cacheStats = (req: any, res: any) => {
  const stats = cacheStore.getStats()
  res.json({
    success: true,
    cache: stats,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Cache invalidation decorator
 * Use with route handlers to auto-invalidate cache on mutations
 */
export const invalidateOnMutation = (cacheKeyPatterns: string[]) => {
  return (req: any, res: any, next: any) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      // Clear related cache entries
      const stats = cacheStore.getStats()
      const keysToDelete = stats.entries
        .filter(entry =>
          cacheKeyPatterns.some(pattern => entry.key.includes(pattern))
        )
        .map(entry => entry.key)

      keysToDelete.forEach(key => cacheStore.delete(key))

      console.log(`✓ Cache INVALIDATED: ${keysToDelete.length} keys cleared`)
    }

    next()
  }
}

/**
 * Usage Example in API Gateway:
 *
 * import { cache, cacheStats, invalidateOnMutation } from './middleware/caching'
 *
 * // Cache configuration with different strategies
 * const cacheStrategies = {
 *   '^/api/v1/users/profile': { ttl: 600 }, // 10 minutes
 *   '^/api/v1/gamification/leaderboard': { ttl: 300 }, // 5 minutes
 *   '^/api/v1/missions': { ttl: 1800 }, // 30 minutes
 * }
 *
 * // Apply conditional caching
 * app.use('/api/v1/', conditionalCache({ strategies: cacheStrategies }))
 *
 * // Invalidate cache on mutations
 * app.post('/api/v1/missions/:id', invalidateOnMutation(['missions']), handleUpdate)
 * app.put('/api/v1/users/profile', invalidateOnMutation(['profile']), handleUpdate)
 *
 * // Cache stats endpoint (for monitoring)
 * app.get('/api/v1/cache/stats', cacheStats)
 *
 * // Manual cache invalidation
 * app.post('/api/v1/cache/clear', invalidateCache())
 * app.post('/api/v1/cache/clear/:pattern', (req, res) => {
 *   invalidateCache([req.params.pattern])(req, res, () => {})
 * })
 */

export default { cache, conditionalCache, invalidateCache, cacheStats, invalidateOnMutation, cacheStore }
