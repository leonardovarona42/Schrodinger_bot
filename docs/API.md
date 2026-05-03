# SchrodingerSec API Documentation

## Dashboard API Routes

### Authentication

All API routes require authentication via NextAuth session.

### GET /api/auth/[...nextauth]

NextAuth handler for:
- Login with credentials
- Session management
- JWT token handling

---

## Bot Commands API (Telegram)

### Moderation Commands

#### `/warn`
Advertir a un usuario en el grupo.

**Permisos requeridos:** MODERATOR, ADMIN, OWNER, SUPER_ADMIN

**Uso:**
```
/warn [motivo]
```
Responder a un mensaje del usuario a advertir.

**Acción:** 
- Crea registro en tabla `Warn`
- Verifica warnLimit de la política
- Si se alcanza el límite y autoBanOnWarn está activo, banea automáticamente

---

#### `/ban`
Banea a un usuario del grupo.

**Permisos requeridos:** MODERATOR, ADMIN, OWNER, SUPER_ADMIN

**Uso:**
```
/ban [motivo]
```
Responder a un mensaje del usuario a banear.

**Acción:** 
- Ejecuta `banChatMember` de Telegram API
- Crea registro en tabla `Log` con actionType: BAN

---

#### `/kick`
Expulsa a un usuario (ban + unban inmediato).

**Permisos requeridos:** MODERATOR, ADMIN, OWNER, SUPER_ADMIN

**Uso:**
```
/kick
```

---

#### `/mute`
Silenciar a un usuario por X minutos.

**Permisos requeridos:** MODERATOR, ADMIN, OWNER, SUPER_ADMIN

**Uso:**
```
/mute [minutos]
```
Por defecto: 15 minutos.

---

#### `/unban`
Desbanear a un usuario.

**Permisos requeridos:** MODERATOR, ADMIN, OWNER, SUPER_ADMIN

---

#### `/unmute`
Desilenciar a un usuario.

**Permisos requeridos:** MODERATOR, ADMIN, OWNER, SUPER_ADMIN

---

### Policy Commands

#### `/policy_set`
Configurar políticas de seguridad del grupo.

**Permisos requeridos:** MODERATOR, ADMIN, OWNER, SUPER_ADMIN

**Uso:**
```
/policy_set <clave> <valor>
```

**Claves disponibles:**
| Clave | Valores | Descripción |
|-------|---------|-------------|
| anti_flood | on/off | Activar/desactivar anti-flood |
| anti_link | on/off | Bloquear enlaces |
| anti_forward | on/off | Bloquear reenvíos |
| anti_spam | on/off | Detección de spam |
| warn_limit | número (1-50) | Límite de warns antes de ban |
| mute_duration | minutos (1-1440) | Duración por defecto del mute |
| flood_limit | número (3-50) | Mensajes por intervalo |
| flood_interval | ms (1000-60000) | Intervalo de flood en ms |
| auto_ban | on/off | Baneo automático al alcanzar warn_limit |
| vt_enabled | on/off | Escaneo con VirusTotal |
| abuse_enabled | on/off | Verificación con AbuseIPDB |

---

#### `/policy_get`
Ver políticas actuales del grupo.

---

### Threat Intelligence Commands

#### `/scanlink`
Escanear un enlace con VirusTotal.

**Permisos requeridos:** MODERATOR, ADMIN, OWNER, SUPER_ADMIN

**Uso:**
```
/scanlink [url]
```
O responder a un mensaje con un enlace.

**Protección SSRF:** Bloquea IPs privadas y localhost.

---

#### `/scanip`
Verificar una IP con AbuseIPDB.

**Permisos requeridos:** MODERATOR, ADMIN, OWNER, SUPER_ADMIN

**Uso:**
```
/scanip [ip]
```

---

#### `/integrations`
Ver estado de integraciones configuradas.

---

## Database Models

### User
```prisma
model User {
  id          String   @id @default(cuid())
  telegramId  BigInt   @unique
  username    String?
  name        String?
  role        Role     @default(MODERATOR)
  groups      Group[]
  warns       Warn[]
  createdWarns Warn[]
  actionsDone Log[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Group
```prisma
model Group {
  id             String   @id @default(cuid())
  telegramId     BigInt   @unique
  name           String?
  members        Int      @default(0)
  admins         User[]
  policy         Policy?
  warns          Warn[]
  logs           Log[]
  blacklistedUrls BlacklistedUrl[]
  whitelistedUrls WhitelistedUrl[]
}
```

### Log
```prisma
model Log {
  id          String     @id @default(cuid())
  groupId     String
  actionType  ActionType
  actorId     String?
  targetId    String?
  details     String?
  metadata    Json?
  createdAt   DateTime   @default(now())
}
```

### Policy
```prisma
model Policy {
  id              String   @id @default(cuid())
  groupId         String   @unique
  antiFlood       Boolean  @default(true)
  antiLink        Boolean  @default(true)
  antiForward     Boolean  @default(false)
  antiSpam        Boolean  @default(true)
  captchaOnJoin   Boolean  @default(false)
  warnLimit       Int      @default(3)
  muteDuration    Int      @default(15)
  floodLimit      Int      @default(5)
  floodInterval   Int      @default(3000)
  autoBanOnWarn   Boolean  @default(true)
  spamSensitivity String   @default("medium")
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| TELEGRAM_BOT_TOKEN | Telegram Bot API token | Yes |
| TELEGRAM_WEBHOOK_SECRET | Secret for webhook verification | Yes |
| NEXTAUTH_SECRET | NextAuth secret key | Yes |
| ADMIN_USERNAME | Dashboard admin username | Yes |
| ADMIN_PASSWORD_HASH | Bcrypt hash of admin password | Yes |
| VIRUSTOTAL_API_KEY | VirusTotal API key | No |
| ABUSEIPDB_API_KEY | AbuseIPDB API key | No |
| VT_ENABLED | Enable VirusTotal scanning | No |
| ABUSE_ENABLED | Enable AbuseIPDB checking | No |
| DEFAULT_WARN_LIMIT | Default warn limit (default: 3) | No |
| DEFAULT_MUTE_MINUTES | Default mute duration (default: 15) | No |
| FLOOD_LIMIT | Default flood limit (default: 5) | No |
| FLOOD_INTERVAL | Default flood interval in ms (default: 3000) | No |
