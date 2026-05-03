import { Role } from "./types.js"

const ADMIN_ROLES: Role[] = ["SUPER_ADMIN", "OWNER", "ADMIN"]
const MODERATOR_ROLES: Role[] = [...ADMIN_ROLES, "MODERATOR"]

export function isAdmin(role: Role): boolean {
  return ADMIN_ROLES.includes(role)
}

export function isModerator(role: Role): boolean {
  return MODERATOR_ROLES.includes(role)
}

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  const hierarchy: Record<Role, number> = {
    SUPER_ADMIN: 5,
    OWNER: 4,
    ADMIN: 3,
    MODERATOR: 2,
    VIEWER: 1,
  }
  return hierarchy[userRole] >= hierarchy[requiredRole]
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
}

export function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&")
}

export function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s<]+/g
  return text.match(urlRegex) || []
}

export function extractIPs(text: string): string[] {
  const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g
  const matches = text.match(ipRegex) || []
  return matches.filter((ip) => {
    const parts = ip.split(".").map(Number)
    return parts.every((p) => p >= 0 && p <= 255)
  })
}

export function isTelegramUrl(url: string): boolean {
  return /^(https?:\/\/)?t\.me\//i.test(url) || /^(https?:\/\/)?telegram\.me\//i.test(url)
}

export function isPrivateIP(ip: string): boolean {
  try {
    const parts = ip.split(".").map(Number)
    if (parts.length !== 4 || parts.some(isNaN)) return false
    if (parts.some((p) => p < 0 || p > 255)) return false

    // 10.0.0.0/8
    if (parts[0] === 10) return true
    // 172.16.0.0/12
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true
    // 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true
    // 127.0.0.0/8 (loopback)
    if (parts[0] === 127) return true
    // 169.254.0.0/16 (link-local)
    if (parts[0] === 169 && parts[1] === 254) return true

    return false
  } catch {
    return true
  }
}

export function isSSRFProtected(url: string): boolean {
  try {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`
    }
    const parsed = new URL(url)
    const hostname = parsed.hostname.toLowerCase()

    // Block private IPs
    if (isPrivateIP(hostname)) return false

    // Block localhost variations
    if (["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(hostname)) return false

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsed.protocol)) return false

    return true
  } catch {
    return false
  }
}
