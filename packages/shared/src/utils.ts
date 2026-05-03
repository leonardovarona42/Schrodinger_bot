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
  const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g
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
