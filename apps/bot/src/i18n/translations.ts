export type SupportedLanguage = "es" | "en" | "pt" | "ru"

export interface Translation {
  // Commands
  warnCommand: string
  banCommand: string
  kickCommand: string
  muteCommand: string
  unbanCommand: string
  unmuteCommand: string
  policySetCommand: string
  policyGetCommand: string
  scanLinkCommand: string
  scanIpCommand: string
  integrationsCommand: string

  // Messages
  noPermission: string
  userWarned: string
  userBanned: string
  userKicked: string
  userMuted: string
  userUnbanned: string
  userUnmuted: string
  replyToMessage: string
  policyUpdated: string
  policyGet: string
  noPolicies: string
  scanResult: string
  privateIpNotAllowed: string
  invalidIp: string
  noIntegrations: string
  integrationsStatus: string
}

const es: Translation = {
  // Commands
  warnCommand: "warn",
  banCommand: "ban",
  kickCommand: "kick",
  muteCommand: "mute",
  unbanCommand: "unban",
  unmuteCommand: "unmute",
  policySetCommand: "policy_set",
  policyGetCommand: "policy_get",
  scanLinkCommand: "scanlink",
  scanIpCommand: "scanip",
  integrationsCommand: "integrations",

  // Messages
  noPermission: "No tienes permisos para ejecutar este comando.",
  userWarned: "⚠️ *{name}* ha sido advertido ({count} warns)\nMotivo: {reason}",
  userBanned: "🚫 *{name}* baneado.\nMotivo: {reason}",
  userKicked: "👢 *{name}* expulsado.",
  userMuted: "🔇 *{name}* silenciado por {duration} minutos.",
  userUnbanned: "✅ *{name}* desbaneado.",
  userUnmuted: "✅ *{name}* desilenciado.",
  replyToMessage: "Responde a un mensaje para {action} al usuario.",
  policyUpdated: "✅ Política actualizada: {key} = {value}",
  policyGet: "📋 *Políticas del Grupo*\n\n{content}",
  noPolicies: "No hay políticas configuradas para este grupo.",
  scanResult: "🔬 *Resultado del escaneo*\n\n{content}",
  privateIpNotAllowed: "Dirección IP privada no permitida para escaneo.",
  invalidIp: "Formato de IP inválido.",
  noIntegrations: "No hay integraciones configuradas.",
  integrationsStatus: "🔌 *Integraciones*\n\n{virustotal}\n{abuseipdb}",
}

const en: Translation = {
  // Commands
  warnCommand: "warn",
  banCommand: "ban",
  kickCommand: "kick",
  muteCommand: "mute",
  unbanCommand: "unban",
  unmuteCommand: "unmute",
  policySetCommand: "policy_set",
  policyGetCommand: "policy_get",
  scanLinkCommand: "scanlink",
  scanIpCommand: "scanip",
  integrationsCommand: "integrations",

  // Messages
  noPermission: "You don't have permission to execute this command.",
  userWarned: "⚠️ *{name}* has been warned ({count} warns)\nReason: {reason}",
  userBanned: "🚫 *{name}* banned.\nReason: {reason}",
  userKicked: "👢 *{name}* kicked.",
  userMuted: "🔇 *{name}* muted for {duration} minutes.",
  userUnbanned: "✅ *{name}* unbanned.",
  userUnmuted: "✅ *{name}* unmuted.",
  replyToMessage: "Reply to a message to {action} the user.",
  policyUpdated: "✅ Policy updated: {key} = {value}",
  policyGet: "📋 *Group Policies*\n\n{content}",
  noPolicies: "No policies configured for this group.",
  scanResult: "🔬 *Scan Result*\n\n{content}",
  privateIpNotAllowed: "Private IP address not allowed for scanning.",
  invalidIp: "Invalid IP format.",
  noIntegrations: "No integrations configured.",
  integrationsStatus: "🔌 *Integrations*\n\n{virustotal}\n{abuseipdb}",
}

const translations: Record<SupportedLanguage, Translation> = {
  es,
  en,
  pt: en, // Fallback to English for now
  ru: en, // Fallback to English for now
}

export function t(lang: SupportedLanguage, key: keyof Translation, params?: Record<string, string | number>): string {
  let text = translations[lang][key] || translations.en[key] || key

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      text = text.replace(`{${key}}`, String(value))
    })
  }

  return text
}

export function detectLanguage(ctx: any): SupportedLanguage {
  const langCode = ctx.from?.language_code || "en"
  if (langCode.startsWith("es")) return "es"
  if (langCode.startsWith("en")) return "en"
  if (langCode.startsWith("pt")) return "pt"
  if (langCode.startsWith("ru")) return "ru"
  return "en"
}
