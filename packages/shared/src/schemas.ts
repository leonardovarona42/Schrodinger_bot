import { z } from "zod"

export const PolicySchema = z.object({
  antiFlood: z.boolean().default(true),
  antiLink: z.boolean().default(true),
  antiForward: z.boolean().default(false),
  antiSpam: z.boolean().default(true),
  captchaOnJoin: z.boolean().default(false),
  warnLimit: z.number().int().min(1).max(20).default(3),
  muteDuration: z.number().int().min(1).max(43200).default(15),
  floodLimit: z.number().int().min(1).max(50).default(5),
  floodInterval: z.number().int().min(1000).max(60000).default(3000),
  autoBanOnWarn: z.boolean().default(true),
  spamSensitivity: z.enum(["low", "medium", "high"]).default("medium"),
  groupRules: z.string().optional(),
  vtEnabled: z.boolean().default(false),
  abuseEnabled: z.boolean().default(false),
})

export const UserSchema = z.object({
  telegramId: z.coerce.bigint(),
  username: z.string().optional(),
  name: z.string().optional(),
  role: z.enum(["SUPER_ADMIN", "OWNER", "ADMIN", "MODERATOR", "VIEWER"]).default("MODERATOR"),
})

export const GroupSettingsSchema = z.object({
  name: z.string().optional(),
  rules: z.string().optional(),
  welcomeMessage: z.string().optional(),
})

export const IntegrationSchema = z.object({
  virustotalApiKey: z.string().optional(),
  abuseipdbApiKey: z.string().optional(),
  vtEnabled: z.boolean().default(false),
  abuseEnabled: z.boolean().default(false),
})

export const ScanUrlSchema = z.object({
  url: z.string().url(),
})

export const ScanIpSchema = z.object({
  ip: z.string().ip(),
})

export type PolicyInput = z.infer<typeof PolicySchema>
export type UserInput = z.infer<typeof UserSchema>
export type GroupSettingsInput = z.infer<typeof GroupSettingsSchema>
