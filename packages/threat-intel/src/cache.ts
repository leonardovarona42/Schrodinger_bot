import { PrismaClient } from "@prisma/client"
import Redis from "ioredis"

const prisma = new PrismaClient()

interface CacheOptions {
  ttlSeconds?: number
}

export class ThreatIntelCache {
  private defaultTTL: number
  private redis: Redis | null = null
  private useRedis: boolean = false

  constructor(defaultTTLSeconds = 3600) {
    this.defaultTTL = defaultTTLSeconds
    
    // Try to initialize Redis if REDIS_URL is available
    if (process.env.REDIS_URL) {
      try {
        this.redis = new Redis(process.env.REDIS_URL)
        this.useRedis = true
        console.log("Redis cache initialized")
      } catch (error) {
        console.warn("Failed to initialize Redis, falling back to Prisma cache:", error)
        this.useRedis = false
      }
    }
  }

  async get(key: string): Promise<any | null> {
    try {
      if (this.useRedis && this.redis) {
        const value = await this.redis.get(key)
        return value ? JSON.parse(value) : null
      }

      // Fallback to Prisma
      const entry = await prisma.cacheEntry.findUnique({
        where: { key },
      })

      if (!entry) return null

      if (new Date() > entry.expiresAt) {
        await prisma.cacheEntry.delete({ where: { key } })
        return null
      }

      return entry.value
    } catch {
      return null
    }
  }

  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    try {
      const ttl = options?.ttlSeconds ?? this.defaultTTL
      
      if (this.useRedis && this.redis) {
        await this.redis.setex(key, ttl, JSON.stringify(value))
        return
      }

      // Fallback to Prisma
      const expiresAt = new Date(Date.now() + ttl * 1000)

      await prisma.cacheEntry.upsert({
        where: { key },
        update: { value, expiresAt },
        create: { key, value, expiresAt },
      })
    } catch {
    }
  }

  async delete(key: string): Promise<void> {
    try {
      if (this.useRedis && this.redis) {
        await this.redis.del(key)
        return
      }
      await prisma.cacheEntry.delete({ where: { key } })
    } catch {
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.useRedis && this.redis) {
        await this.redis.flushdb()
        return
      }
      await prisma.cacheEntry.deleteMany({})
    } catch {
    }
  }

  // Cleanup expired entries (Prisma only)
  async cleanup(): Promise<void> {
    try {
      if (!this.useRedis) {
        await prisma.cacheEntry.deleteMany({
          where: { expiresAt: { lt: new Date() } },
        })
      }
    } catch {
    }
  }

  // Close connections
  async disconnect(): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.quit()
      }
      await prisma.$disconnect()
    } catch {
    }
  }
}

// Singleton instance
export const cache = new ThreatIntelCache()
