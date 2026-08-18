/**
 * Simple in-memory rate limiter for API routes.
 * For production, replace with Upstash Redis or similar.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

interface RateLimitOptions {
  windowMs: number  // time window in ms
  max: number       // max requests per window
}

export function rateLimit(options: RateLimitOptions) {
  return function check(ip: string): { success: boolean; remaining: number } {
    const now = Date.now()
    const key = ip

    const entry = store.get(key)

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + options.windowMs })
      return { success: true, remaining: options.max - 1 }
    }

    if (entry.count >= options.max) {
      return { success: false, remaining: 0 }
    }

    entry.count++
    return { success: true, remaining: options.max - entry.count }
  }
}

// Preset limiters
export const contactLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 5 })
export const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 })
export const applicationLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 3 })
