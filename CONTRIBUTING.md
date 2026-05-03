# Contributing to SchrodingerSec Platform

¡Gracias por tu interés en contribuir! Este documento te guiará a través del proceso.

## Estructura del Proyecto

Este es un monorepo que usa npm workspaces + Turborepo:

```
Schrodinger_bot/
├── apps/
│   ├── bot/              # Telegram bot (Grammy framework)
│   └── dashboard/        # Next.js 15 web dashboard
├── packages/
│   ├── database/         # Prisma client + schema
│   ├── auth/            # NextAuth v4 configuration
│   ├── threat-intel/    # VirusTotal + AbuseIPDB clients
│   └── shared/          # Shared types, schemas, utilities
```

## Pre-requisitos

- Node.js >= 20
- npm >= 10
- PostgreSQL >= 14
- Git

## Configuración del Entorno de Desarrollo

1. Fork el repositorio
2. Clona tu fork:
   ```bash
   git clone https://github.com/tu-usuario/Schrodinger_bot.git
   cd Schrodinger_bot
   ```

3. Instala dependencias:
   ```bash
   npm install
   ```

4. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   # Edita .env con tus credenciales
   ```

5. Ejecuta las migraciones:
   ```bash
   npm run db:migrate
   ```

6. Inicia el entorno de desarrollo:
   ```bash
   npm run dev
   ```

## Flujo de Trabajo

1. Crea una rama desde `features`:
   ```bash
   git checkout features
   git pull origin features
   git checkout -b feature/nombre-descriptivo
   ```

2. Haz tus cambios siguiendo las convenciones:

### Convenciones de Código

- **TypeScript**: Usa tipos explícitos, evita `any`
- **Nombrado**: camelCase para variables, PascalCase para componentes/clases
- **Componentes**: Functional components con hooks
- **Imports**: Imports absolutos con `@schrodinger/*` para paquetes locales

### Estructura de Commits

Usa [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

**Tipos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `refactor`: Refactorización sin cambios de funcionalidad
- `docs`: Cambios en documentación
- `style`: Formateo, no cambios de lógica
- `test`: Agregar o corregir tests
- `chore`: Tareas de mantenimiento

**Ejemplos:**
```bash
feat(bot): add /scanip command for AbuseIPDB integration
fix(dashboard): correct Prisma groupBy syntax for analytics
refactor(shared): extract validation schemas to @schrodinger/shared
docs: update README with installation instructions
```

## Áreas donde Necesitamos Ayuda

- 🌐 **i18n**: Multi-language support para el bot
- 📊 **Features**: Nuevas funcionalidades de seguridad
- 🧪 **Testing**: Unit tests y integration tests
- 📚 **Docs**: Mejorar documentación
- 🎨 **UI/UX**: Mejoras al dashboard
- ⚡ **Performance**: Optimizaciones de queries y caching

## Pull Request Process

1. Asegúrate de que tu código pasa linting:
   ```bash
   npm run lint
   ```

2. Si hay cambios en la base de datos, genera una migration:
   ```bash
   cd packages/database
   npx prisma migrate dev --name describe_your_change
   ```

3. Testea tus cambios localmente

4. Haz push a tu rama:
   ```bash
   git push origin feature/nombre-descriptivo
   ```

5. Crea un Pull Request contra la rama `features`

6. Describe claramente:
   - Qué cambios hiciste
   - Por qué los hiciste
   - Cómo probarlos
   - Capturas de pantalla (si es UI)

## Reportar Bugs

Usa [GitHub Issues](https://github.com/leonardovarona42/Schrodinger_bot/issues) con la etiqueta `bug`:

```
**Descripción:**
Breve descripción del problema.

**Pasos para reproducir:**
1. Ir a '...'
2. Hacer clic en '...'
3. Ver error

**Comportamiento esperado:**
Qué debería pasar.

**Capturas:**
Si aplica.

**Entorno:**
- OS: [ej. Windows 11, Ubuntu 22.04]
- Node.js: [ej. v20.10.0]
- Browser: [ej. Chrome 120] (si aplica)
```

## Código de Conducta

- Sé respetuoso y constructivo
- Acepta feedback con mente abierta
- Ayuda a otros colaboradores
- No compitas credenciales o datos sensibles

## Licencia

Al contribuir, aceptas que tu contribución será licenciada bajo MIT License.

---

¡Gracias por contribuir a hacer Telegram más seguro! 🔒
