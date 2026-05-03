export type Role = "SUPER_ADMIN" | "OWNER" | "ADMIN" | "MODERATOR" | "VIEWER"

export type ActionType =
  | "WARN"
  | "MUTE"
  | "BAN"
  | "KICK"
  | "UNBAN"
  | "UNMUTE"
  | "DELETE_MESSAGE"
  | "BLACKLIST"
  | "WHITELIST"
  | "FLOOD_DETECTED"
  | "LINK_BLOCKED"
  | "IP_BLOCKED"
  | "SYSTEM"

export interface TelegramGroup {
  id: string
  telegramId: bigint
  name?: string
  members: number
}

export interface TelegramUser {
  id: string
  telegramId: bigint
  username?: string
  name?: string
  role: Role
}

export interface PolicyConfig {
  antiFlood: boolean
  antiLink: boolean
  antiForward: boolean
  antiSpam: boolean
  captchaOnJoin: boolean
  warnLimit: number
  muteDuration: number
  floodLimit: number
  floodInterval: number
  autoBanOnWarn: boolean
  spamSensitivity: "low" | "medium" | "high"
  groupRules?: string
  vtEnabled: boolean
  abuseEnabled: boolean
}

export interface ThreatIntelResult {
  isMalicious: boolean
  score: number
  details: string
  source: "virustotal" | "abuseipdb"
}

export interface VirusTotalUrlReport {
  malicious: number
  suspicious: number
  harmless: number
  undetected: number
  score: number
  permalink: string
}

export interface AbuseIPDBReport {
  abuseConfidenceScore: number
  isWhitelisted: boolean
  countryCode: string
  usageType: string
  totalReports: number
  lastReportedAt: string
}

export interface ScanResult {
  isMalicious: boolean
  score: number
  source: string
  details: string
  permalink?: string
}

export interface FloodTracker {
  userId: bigint
  groupId: bigint
  timestamps: number[]
}
