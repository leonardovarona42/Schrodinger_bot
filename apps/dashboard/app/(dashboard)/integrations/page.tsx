import { prisma } from "@schrodinger/database"
import { Card } from "@/components/ui"
import { Plug, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default async function IntegrationsPage() {
  const integration = await prisma.integration.findFirst()

  const vtEnabled = integration?.vtEnabled ?? false
  const abuseEnabled = integration?.abuseEnabled ?? false
  const hasVtKey = !!integration?.virustotalApiKey
  const hasAbuseKey = !!integration?.abuseipdbApiKey

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Integraciones</h1>
        <p className="text-slate-500 mt-1">Servicios externos de threat intelligence</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="VirusTotal"
          description="Escaneo de URLs y dominios maliciosos"
          action={
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                vtEnabled && hasVtKey
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {vtEnabled && hasVtKey ? "Activo" : "Inactivo"}
            </span>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {hasVtKey ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="text-sm font-medium text-slate-900">API Key</p>
                <p className="text-xs text-slate-500">
                  {hasVtKey
                    ? `Configurada (****${integration?.virustotalApiKey?.slice(-4)})`
                    : "No configurada"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {vtEnabled ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="text-sm font-medium text-slate-900">Estado</p>
                <p className="text-xs text-slate-500">
                  {vtEnabled ? "Consultas automaticas activas" : "Desactivado"}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Cuota utilizada</span>
                <span className="font-medium">
                  {integration?.vtQuotaUsed || 0} / {integration?.vtQuotaLimit || 500}
                </span>
              </div>
              <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      ((integration?.vtQuotaUsed || 0) / (integration?.vtQuotaLimit || 500)) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card
          title="AbuseIPDB"
          description="Verificacion de reputacion de IPs"
          action={
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                abuseEnabled && hasAbuseKey
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {abuseEnabled && hasAbuseKey ? "Activo" : "Inactivo"}
            </span>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {hasAbuseKey ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="text-sm font-medium text-slate-900">API Key</p>
                <p className="text-xs text-slate-500">
                  {hasAbuseKey
                    ? `Configurada (****${integration?.abuseipdbApiKey?.slice(-4)})`
                    : "No configurada"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {abuseEnabled ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <p className="text-sm font-medium text-slate-900">Estado</p>
                <p className="text-xs text-slate-500">
                  {abuseEnabled ? "Consultas automaticas activas" : "Desactivado"}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Cuota utilizada</span>
                <span className="font-medium">
                  {integration?.abuseQuotaUsed || 0} / {integration?.abuseQuotaLimit || 1000}
                </span>
              </div>
              <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      ((integration?.abuseQuotaUsed || 0) / (integration?.abuseQuotaLimit || 1000)) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Nota" description="Configuracion de API Keys">
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium">Las API Keys se configuran via variables de entorno</p>
            <p className="mt-1 text-blue-600">
              Establece <code className="bg-blue-100 px-1 py-0.5 rounded">VIRUSTOTAL_API_KEY</code> y{" "}
              <code className="bg-blue-100 px-1 py-0.5 rounded">ABUSEIPDB_API_KEY</code> en tu archivo .env
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
