import { NextApiRequest } from "next"
import { prisma } from "@schrodinger/database"

interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
  keyPrefix?: string
}

export class RateLimiter {
  private maxAttempts: number
  private windowMs: number
  private keyPrefix: string

  constructor(config: RateLimitConfig) {
    this.maxAttempts = config.maxAttempts
    this.windowMs = config.windowMs
    this.keyPrefix = config.keyPrefix || "rate_limit"
  }

  async check(identifier: string): Promise<{ success: boolean; remaining: number; resetTime: Date }> {
    const key = `${this.keyPrefix}:${identifier}`
    const now = new Date()
    const windowStart = new Date(now.getTime() - this.windowMs)

    // Clean up old entries
    await prisma.cacheEntry.deleteMany({
      where: {
        key: { startsWith: this.keyPrefix },
        expiresAt: { lt: now },
      },
    })

    // Get or create rate limit entry
    const entry = await prisma.cacheEntry.findUnique({ where: { key } })

    if (!entry) {
      const expiresAt = new Date(now.getTime() + this.windowMs)
      await prisma.cacheEntry.create({
        data: {
          key,
          value: { attempts: 1, firstAttempt: now.toISOString() },
          expiresAt,
        },
      })
      return { success: true, remaining: this.maxAttempts - 1, resetTime: expiresAt }
    }

    const data = entry.value as { attempts: number; firstAttempt: string }
    const attempts = data.attempts + 1

    if (attempts > this.maxAttempts) {
      return { success: false, remaining: 0, resetTime: entry.expiresAt }
    }

    await prisma.cacheEntry.update({
      where: { key },
      data: { value: { attempts, firstAttempt: data.firstAttempt } },
    })

    return { success: true, remaining: this.maxAttempts - attempts, resetTime: entry.expiresAt }
  }
}

// Pre-configured rate limiters
export const loginRateLimiter = new RateLimiter({
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  keyPrefix: "login",
})
