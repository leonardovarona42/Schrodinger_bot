import { Card } from "@/components/ui"
import { Settings as SettingsIcon, Key, Globe, Bell } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuracion</h1>
        <p className="text-slate-500 mt-1">Ajustes generales de la plataforma</p>
      </div>

      <div className="grid gap-4">
        <Card title="Bot de Telegram" description="Configuracion del webhook y token">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                TELEGRAM_BOT_TOKEN
              </label>
              <input
                type="password"
                defaultValue={process.env.TELEGRAM_BOT_TOKEN || ""}
                disabled
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                placeholder="No configurado"
              />
              <p className="text-xs text-slate-500 mt-1">
                Configurable via variables de entorno
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                TELEGRAM_WEBHOOK_SECRET
              </label>
              <input
                type="password"
                defaultValue={process.env.TELEGRAM_WEBHOOK_SECRET || ""}
                disabled
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                placeholder="No configurado"
              />
            </div>
          </div>
        </Card>

        <Card title="Base de Datos" description="Conexion PostgreSQL">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                DATABASE_URL
              </label>
              <input
                type="password"
                defaultValue={process.env.DATABASE_URL ? "postgresql://***:***@***:5432/***" : ""}
                disabled
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                placeholder="No configurado"
              />
              <p className="text-xs text-slate-500 mt-1">
                Configurable via variables de entorno
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                REDIS_URL
              </label>
              <input
                type="password"
                defaultValue={process.env.REDIS_URL || ""}
                disabled
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                placeholder="No configurado"
              />
            </div>
          </div>
        </Card>

        <Card title="Threat Intelligence" description="API Keys de servicios externos">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                VIRUSTOTAL_API_KEY
              </label>
              <input
                type="password"
                defaultValue={process.env.VIRUSTOTAL_API_KEY || ""}
                disabled
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                placeholder="No configurado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                ABUSEIPDB_API_KEY
              </label>
              <input
                type="password"
                defaultValue={process.env.ABUSEIPDB_API_KEY || ""}
                disabled
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
                placeholder="No configurado"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={process.env.VT_ENABLED === "true"}
                  disabled
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">VirusTotal habilitado</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={process.env.ABUSE_ENABLED === "true"}
                  disabled
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">AbuseIPDB habilitado</span>
              </label>
            </div>
          </div>
        </Card>

        <Card title="Valores por Defecto" description="Configuracion inicial de grupos">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Limite de Warns
              </label>
              <input
                type="number"
                defaultValue={process.env.DEFAULT_WARN_LIMIT || "3"}
                disabled
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Duracion de Mute (min)
              </label>
              <input
                type="number"
                defaultValue={process.env.DEFAULT_MUTE_MINUTES || "15"}
                disabled
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Flood Limit
              </label>
              <input
                type="number"
                defaultValue={process.env.FLOOD_LIMIT || "5"}
                disabled
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Flood Interval (ms)
              </label>
              <input
                type="number"
                defaultValue={process.env.FLOOD_INTERVAL || "3000"}
                disabled
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
              />
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Estos valores se configuran en el archivo <code className="bg-blue-100 px-1 rounded">.env</code>.
              Los cambios requieren reiniciar el bot para aplicar.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
