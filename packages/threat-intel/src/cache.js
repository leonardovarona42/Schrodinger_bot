import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export class ThreatIntelCache {
    defaultTTL;
    constructor(defaultTTLSeconds = 3600) {
        this.defaultTTL = defaultTTLSeconds;
    }
    async get(key) {
        try {
            const entry = await prisma.cacheEntry.findUnique({
                where: { key },
            });
            if (!entry)
                return null;
            if (new Date() > entry.expiresAt) {
                await prisma.cacheEntry.delete({ where: { key } });
                return null;
            }
            return entry.value;
        }
        catch {
            return null;
        }
    }
    async set(key, value, options) {
        try {
            const ttl = options?.ttlSeconds ?? this.defaultTTL;
            const expiresAt = new Date(Date.now() + ttl * 1000);
            await prisma.cacheEntry.upsert({
                where: { key },
                update: { value, expiresAt },
                create: { key, value, expiresAt },
            });
        }
        catch {
        }
    }
    async delete(key) {
        try {
            await prisma.cacheEntry.delete({ where: { key } });
        }
        catch {
        }
    }
    async clear() {
        try {
            await prisma.cacheEntry.deleteMany({});
        }
        catch {
        }
    }
    // Cleanup expired entries
    async cleanup() {
        try {
            await prisma.cacheEntry.deleteMany({
                where: { expiresAt: { lt: new Date() } },
            });
        }
        catch {
        }
    }
}
// Singleton instance
export const cache = new ThreatIntelCache();
//# sourceMappingURL=cache.js.map