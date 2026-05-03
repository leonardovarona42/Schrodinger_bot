export const BOT_NAME = "Schr\\u00f6dingerSec Bot"

export const COMMAND_PREFIX = "/"

export const DEFAULT_WARN_LIMIT = 3
export const DEFAULT_MUTE_MINUTES = 15
export const DEFAULT_FLOOD_LIMIT = 5
export const DEFAULT_FLOOD_INTERVAL = 3000

export const CACHE_TTL = {
  VIRUSTOTAL_URL: 3600 * 24,
  ABUSEIPDB_IP: 3600 * 12,
  GROUP_SETTINGS: 300,
  USER_SETTINGS: 600,
}

export const MESSAGES = {
  WELCOME: `
\\🔬 **${BOT_NAME}**

Sistema avanzado de moderaci\\u00f3n y ciberseguridad para Telegram.

Usa /help para ver los comandos disponibles.
`.trim(),

  HELP: `
\\📋 **Comandos Disponibles**

**B\\u00e1sicos:**
/start \\- Iniciar el bot
/help \\- Mostrar ayuda
/ping \\- Verificar estado
/settings \\- Ver configuraci\\u00f3n

**Moderaci\\u00f3n:**
/warn \\[usuario\\] \\[motivo\\] \\- Advertir usuario
/mute \\[usuario\\] \\[duraci\\u00f3n\\] \\- Silenciar usuario
/ban \\[usuario\\] \\[motivo\\] \\- Banear usuario
/kick \\[usuario\\] \\- Expulsar usuario
/unban \\[usuario\\] \\- Desbanear usuario
/unmute \\[usuario\\] \\- Desilenciar usuario

**Threat Intelligence:**
/scanlink \\[url\\] \\- Escanear URL con VirusTotal
/scanip \\[ip\\] \\- Verificar IP con AbuseIPDB
/threatcheck \\- Resumen de amenazas del grupo

**Listas:**
/blacklist \\[url\\] \\- A\\u00f1adir URL a lista negra
/blacklist_rm \\[url\\] \\- Eliminar de lista negra
/whitelist \\[url\\] \\- A\\u00f1adir URL a lista blanca
/whitelist_rm \\[url\\] \\- Eliminar de lista blanca

**Pol\\u00edticas:**
/policy \\- Ver pol\\u00edtica actual
/policy_set \\- Configurar pol\\u00edticas

**Administraci\\u00f3n:**
/integrations \\- Ver integraciones
/logs \\- Ver logs recientes
`.trim(),

  NOT_ADMIN: "\\u274c No tienes permisos para ejecutar este comando.",
  USER_NOT_FOUND: "\\u274c Usuario no encontrado.",
  WARN_ADDED: (reason: string) => `\\u26a0\\ufe0f Advertencia registrada. Motivo: ${reason}`,
  USER_MUTED: (duration: string) => `\\ud83d\\udd07 Usuario silenciado por ${duration}.`,
  USER_BANNED: " \\ud83d\\udeab Usuario baneado.",
  USER_KICKED: "\\ud83d\\udc62 Usuario expulsado.",
  USER_UNBANNED: "\\u2705 Usuario desbaneado.",
  USER_UNMUTED: "\\u2705 Usuario desilenciado.",
}
