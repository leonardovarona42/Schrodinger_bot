import { Card } from "@/components/ui"
import { Settings, Key, Database, Shield, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuracion</h1>
        <p className="text-slate-500 mt-1">Ajustes generales de la plataforma</p>
      </div>

      <div className="grid gap-6">
        <Card title="Bot de Telegram" description="Configuracion del webhook y token">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                TELEGRAM_BOT_TOKEN
              </label>
              <input
                type="password"
                defaultValue={process.env.TELEGRAM_BOT_TOKEN || ""}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-500"
                placeholder="No configurado"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                TELEGRAM_WEBHOOK_SECRET
              </label>
              <input
                type="password"
                defaultValue={process.env.TELEGRAM_WEBHOOK_SECRET || ""}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-500"
                placeholder="No configurado"
              />
            </div>
          </div>
        </Card>

        <Card title="Base de Datos" description="Conexion PostgreSQL">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                DATABASE_URL
              </label>
              <input
                type="password"
                defaultValue={process.env.DATABASE_URL ? "postgresql://***:***@***:5432/***" : ""}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-500"
                placeholder="No configurado"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                REDIS_URL
              </label>
              <input
                type="password"
                defaultValue={process.env.REDIS_URL || ""}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-500"
                placeholder="No configurado"
              />
            </div>
          </div>
        </Card>

        <Card title="Threat Intelligence" description="API Keys de servicios externos">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                VIRUSTOTAL_API_KEY
              </label>
              <input
                type="password"
                defaultValue={process.env.VIRUSTOTAL_API_KEY || ""}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-500"
                placeholder="No configurado"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ABUSEIPDB_API_KEY
              </label>
              <input
                type="password"
                defaultValue={process.env.ABUSEIPDB_API_KEY || ""}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-500"
                placeholder="No configurado"
              />
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={process.env.VT_ENABLED === "true"}
                  disabled
                  className="w-4 h-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm font-medium text-slate-700">VirusTotal habilitado</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={process.env.ABUSE_ENABLED === "true"}
                  disabled
                  className="w-4 h-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm font-medium text-slate-700">AbuseIPDB habilitado</span>
              </label>
            </div>
          </div>
        </Card>

        <Card title="Valores por Defecto" description="Configuracion inicial de grupos">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Limite de Warns
              </label>
              <input
                type="number"
                defaultValue={process.env.DEFAULT_WARN_LIMIT || "3"}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duracion de Mute (min)
              </label>
              <input
                type="number"
                defaultValue={process.env.DEFAULT_MUTE_MINUTES || "15"}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Flood Limit
              </label>
              <input
                type="number"
                defaultValue={process.env.FLOOD_LIMIT || "5"}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Flood Interval (ms)
              </label>
              <input
                type="number"
                defaultValue={process.env.FLOOD_INTERVAL || "3000"}
                disabled
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-500"
              />
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Estos valores se configuran en el archivo <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">.env</code>. Los cambios requieren reiniciar el bot para aplicar.
            </p>
          </div>
        </Card>

        <Card title="Autenticacion" description="Credenciales del dashboard">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-900">ADMIN_USERNAME</p>
                <p className="text-xs text-slate-500">Usuario administrador</p>
              </div>
              <code className="px-3 py-1 bg-white border border-slate-200 rounded-md text-sm font-mono text-slate-700">
                {process.env.ADMIN_USERNAME || "admin"}
              </code>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-900">ADMIN_PASSWORD</p>
                <p className="text-xs text-slate-500">Contrasena del dashboard</p>
              </div>
              <code className="px-3 py-1 bg-white border border-slate-200 rounded-md text-sm font-mono text-slate-700">
                {process.env.ADMIN_PASSWORD || "no-configurada"}
              </code>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
