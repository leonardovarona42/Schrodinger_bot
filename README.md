# SchrodingerSec Platform

Plataforma de seguridad para Telegram que combina un bot moderador inteligente con un dashboard web de monitoreo y análisis de amenazas.

## Características

### Bot de Telegram
- **Moderación automática**: Anti-flood, anti-link, anti-spam, anti-forward
- **Gestión de usuarios**: Warns, bans, mutes, kicks con control de permisos
- **Threat Intelligence**: Integración con VirusTotal y AbuseIPDB para verificación de URLs e IPs maliciosas
- **Políticas configurables**: Por grupo con ajustes en tiempo real vía comandos
- **Blacklist/Whitelist**: Gestión de URLs permitidas/bloqueadas

### Dashboard Web (Next.js)
- **Analytics**: Estadísticas de eventos de seguridad y moderación
- **Gestión de grupos**: Ver y administrar todos los grupos con el bot
- **Logs**: Ver historial de acciones de moderación
- **Configuración**: Ajustes de integraciones y políticas
- **RBAC**: Control de acceso basado en roles (SUPER_ADMIN, OWNER, ADMIN, MODERATOR, VIEWER)

## Arquitectura

```
Schrodinger_bot/
├── apps/
│   ├── bot/              # Bot de Telegram (Grammy)
│   └── dashboard/        # Dashboard web (Next.js 15 + React 19)
├── packages/
│   ├── database/         # Prisma + PostgreSQL
│   ├── auth/            # NextAuth v4 configuración
│   ├── threat-intel/    # VirusTotal + AbuseIPDB clients
│   └── shared/          # Tipos, schemas y utilidades compartidas
```

## Requisitos

- Node.js >= 20
- PostgreSQL >= 14
- Redis (opcional, para caching)
- Token de Telegram Bot
- API Keys: VirusTotal y AbuseIPDB (opcional)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/leonardovarona42/Schrodinger_bot.git
cd Schrodinger_bot
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crea un archivo `.env` en la raíz basado en `.env.example`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/schrodinger"

# Telegram Bot
TELEGRAM_BOT_TOKEN="tu_token_aqui"
TELEGRAM_WEBHOOK_SECRET="secreto_para_webhook"

# NextAuth
NEXTAUTH_SECRET="secreto_nextauth"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="bcrypt_hash_aqui"

# Threat Intelligence (opcional)
VIRUSTOTAL_API_KEY="tu_api_key"
ABUSEIPDB_API_KEY="tu_api_key"
VT_ENABLED="false"
ABUSE_ENABLED="false"

# Configuraciones por defecto
DEFAULT_WARN_LIMIT=3
DEFAULT_MUTE_MINUTES=15
FLOOD_LIMIT=5
FLOOD_INTERVAL=3000
```

4. Ejecutar migraciones:
```bash
npm run db:migrate
```

5. Generar hash de contraseña para ADMIN_PASSWORD_HASH:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('tu_password', 10).then(console.log)"
```

6. Iniciar en modo desarrollo:
```bash
npm run dev
```

## Comandos del Bot

### Moderación (requiere permisos)
- `/warn` - Advertir usuario (respondiendo a un mensaje)
- `/ban` - Banear usuario
- `/kick` - Expulsar usuario
- `/mute [minutos]` - Silenciar usuario
- `/unban` - Desbanear usuario
- `/unmute` - Desilenciar usuario

### Configuración
- `/policy_set <clave> <valor>` - Cambiar políticas del grupo
  - Ejemplos: `/policy_set anti_flood on`, `/policy_set warn_limit 5`
- `/policy_get` - Ver políticas actuales

### Threat Intelligence
- `/scanlink [url]` - Escanear enlace con VirusTotal
- `/scanip [ip]` - Verificar IP con AbuseIPDB
- `/integrations` - Ver estado de integraciones

## Dashboard

Accede a `http://localhost:3000` para el dashboard.

### Roles de Usuario
- **SUPER_ADMIN**: Acceso total
- **OWNER**: Control total excepto configuración global
- **ADMIN**: Gestión de grupos y políticas
- **MODERATOR**: Moderación básica (warn, kick, mute)
- **VIEWER**: Solo lectura

## Scripts Disponibles

```bash
npm run dev          # Inicia todos los servicios en desarrollo
npm run build        # Build de todos los paquetes
npm run lint         # Linting
npm run db:generate  # Generar cliente Prisma
npm run db:migrate   # Ejecutar migraciones
npm run db:studio    # Abrir Prisma Studio
```

## Seguridad

- Autenticación con NextAuth v4 + bcrypt
- RBAC (Role-Based Access Control)
- Protección contra SSRF en escaneo de URLs
- Validación de permisos en todos los comandos
- Cookies seguras (httpOnly, sameSite, secure en producción)
- Headers de seguridad (CSP, X-Frame-Options, etc.)

## Contribuir

Ver [CONTRIBUTING.md](./CONTRIBUTING.md) para detalles sobre cómo contribuir.

## Licencia

MIT
