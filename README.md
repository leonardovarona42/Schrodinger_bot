# SchrodingerSec Platform

Plataforma profesional de moderacion y ciberseguridad para comunidades de Telegram con dashboard web e inteligencia de amenazas integrada.

## Caracteristicas

- **Bot de Telegram** con moderacion automatica y proteccion anti-spam/flood
- **Dashboard Web** administrativo con gestion multi-grupo
- **Threat Intelligence** integrado con VirusTotal y AbuseIPDB
- **Sistema de warns, bans, kicks, mutes** configurable
- **Deteccion de enlaces sospechosos** en tiempo real
- **Panel de analytics** con estadisticas detalladas
- **Arquitectura monorepo** con Turborepo

## Stack Tecnologico

- **Bot:** Node.js, TypeScript, grammY, Hono
- **Dashboard:** Next.js 15, React 19, TailwindCSS, lucide-react
- **Base de datos:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js
- **Build:** Turborepo

## Estructura del Proyecto

```
schrodinger-platform/
├── apps/
│   ├── bot/                    # Bot de Telegram
│   │   ├── api/                # API webhook endpoint
│   │   └── src/
│   │       ├── commands/       # Comandos del bot
│   │       ├── middlewares/    # Middlewares (flood, anti-link)
│   │       ├── services/       # Servicios (logging, moderation)
│   │       └── database/       # Cliente DB compartido
│   │
│   └── dashboard/              # Dashboard web
│       ├── app/                # Next.js app router
│       ├── components/         # Componentes UI
│       └── lib/                # Utilidades
│
├── packages/
│   ├── shared/                 # Tipos y schemas compartidos
│   ├── database/               # Prisma schema y cliente
│   ├── threat-intel/           # Servicios VirusTotal/AbuseIPDB
│   └── auth/                   # Configuracion NextAuth
│
├── .env.example
├── turbo.json
└── package.json
```

## Instalacion

### Requisitos

- Node.js >= 20
- PostgreSQL 15+
- Redis (opcional, para caching avanzado)

### Pasos

1. Clonar el repositorio

```bash
git clone <repo-url>
cd Schrodinger_bot
```

2. Copiar y configurar variables de entorno

```bash
cp .env.example .env
```

3. Instalar dependencias

```bash
npm install
```

4. Configurar la base de datos

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

5. Iniciar en desarrollo

```bash
npm run dev
```

## Variables de Entorno

| Variable | Descripcion |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Token del bot de Telegram |
| `TELEGRAM_WEBHOOK_SECRET` | Secret para webhook en produccion |
| `DATABASE_URL` | URL de conexion PostgreSQL |
| `REDIS_URL` | URL de Redis (opcional) |
| `NEXTAUTH_SECRET` | Secret para NextAuth |
| `NEXTAUTH_URL` | URL base del dashboard |
| `VIRUSTOTAL_API_KEY` | API Key de VirusTotal |
| `ABUSEIPDB_API_KEY` | API Key de AbuseIPDB |
| `VT_ENABLED` | Habilitar VirusTotal (true/false) |
| `ABUSE_ENABLED` | Habilitar AbuseIPDB (true/false) |
| `DEFAULT_WARN_LIMIT` | Limite de warns antes de ban |
| `DEFAULT_MUTE_MINUTES` | Duracion por defecto del mute |
| `FLOOD_LIMIT` | Mensajes para detectar flood |
| `FLOOD_INTERVAL` | Intervalo en ms para flood detection |

## Comandos del Bot

### Basicos
- `/start` - Iniciar el bot
- `/help` - Mostrar ayuda
- `/ping` - Verificar estado
- `/settings` - Ver configuracion del grupo

### Moderacion
- `/warn [motivo]` - Advertir usuario (responder a mensaje)
- `/mute [minutos]` - Silenciar usuario
- `/ban [motivo]` - Banear usuario
- `/kick` - Expulsar usuario
- `/unban` - Desbanear usuario
- `/unmute` - Desilenciar usuario

### Threat Intelligence
- `/scanlink [url]` - Escanear URL con VirusTotal
- `/scanip [ip]` - Verificar IP con AbuseIPDB
- `/threatcheck` - Resumen de amenazas del grupo

### Listas
- `/blacklist [url]` - Anadir URL a lista negra
- `/blacklist_rm [url]` - Eliminar de lista negra
- `/whitelist [url]` - Anadir URL a lista blanca
- `/whitelist_rm [url]` - Eliminar de lista blanca

### Politicas
- `/policy` - Ver politica actual
- `/policy_set <clave> <valor>` - Configurar politicas
- `/integrations` - Ver estado de integraciones

## Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Base de datos
npm run db:generate   # Generar cliente Prisma
npm run db:migrate    # Ejecutar migraciones
npm run db:push       # Push schema a DB
npm run db:seed       # Seed inicial
npm run db:studio     # Abrir Prisma Studio
```

## Despliegue

### Vercel

El dashboard se puede desplegar en Vercel directamente:

1. Conectar el repositorio a Vercel
2. Configurar variables de entorno
3. Deploy

### Bot (Polling)

Para desarrollo o servidores con acceso persistente:

```bash
cd apps/bot
npm run dev
```

### Bot (Webhook)

Para produccion en serverless (Vercel, Railway):

1. Configurar `TELEGRAM_WEBHOOK_SECRET`
2. Configurar el webhook en Telegram:

```bash
curl -X POST "https://api.telegram.org/bot<token>/setWebhook" \
  -d "url=https://tu-dominio.com/webhook/<secret>"
```

## Arquitectura

### Flujo de Seguridad

1. Usuario publica un mensaje
2. Middleware de flood detection verifica rate limit
3. Middleware anti-link extrae URLs del mensaje
4. URLs en blacklist se bloquean inmediatamente
5. URLs no permitidas se escanean con VirusTotal
6. Si el score es malicioso: se elimina el mensaje y se aplica warn
7. Se registran todos los eventos en logs

### Multi-Tenant

Cada grupo de Telegram tiene:
- Politicas de seguridad independientes
- Listas blancas/negras propias
- Logs y estadisticas separadas

## Licencia

MIT
