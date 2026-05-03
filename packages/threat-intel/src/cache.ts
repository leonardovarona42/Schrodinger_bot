import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

interface CacheOptions {
  ttlSeconds?: number
}

export class ThreatIntelCache {
  private defaultTTL: number

  constructor(defaultTTLSeconds = 3600) {
    this.defaultTTL = defaultTTLSeconds
  }

  async get(key: string): Promise<any | null> {
    try {
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
      await prisma.cacheEntry.delete({ where: { key } })
    } catch {
    }
  }

  async clear(): Promise<void> {
    try {
      await prisma.cacheEntry.deleteMany({})
    } catch {
    }
  }

  // Cleanup expired entries
  async cleanup(): Promise<void> {
    try {
      await prisma.cacheEntry.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      })
    } catch {
    }
  }
}

// Singleton instance
export const cache = new ThreatIntelCache()
