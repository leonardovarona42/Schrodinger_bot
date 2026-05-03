import { prisma } from "@schrodinger/database"
import { Card } from "@/components/ui"
import { CheckCircle, XCircle, AlertCircle, Shield, Globe } from "lucide-react"

export default async function IntegrationsPage() {
  const integration = await prisma.integration.findFirst()

  const vtEnabled = integration?.vtEnabled ?? false
  const abuseEnabled = integration?.abuseEnabled ?? false
  const hasVtKey = !!integration?.virustotalApiKey
  const hasAbuseKey = !!integration?.abuseipdbApiKey

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Integraciones</h1>
        <p className="text-slate-500 mt-1">Servicios externos de threat intelligence</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card
          title="VirusTotal"
          description="Escaneo de URLs y dominios maliciosos"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">API Key</p>
                <p className="text-xs text-slate-500">
                  {hasVtKey ? `Configurada (****${integration?.virustotalApiKey?.slice(-4)})` : "No configurada"}
                </p>
              </div>
              {hasVtKey ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <XCircle className="w-5 h-5 text-slate-400" />
              )}
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Estado</p>
                <p className="text-xs text-slate-500">
                  {vtEnabled ? "Consultas automaticas activas" : "Desactivado"}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                vtEnabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
              }`}>
                {vtEnabled ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500">Cuota utilizada</span>
                <span className="font-medium text-slate-900">
                  {integration?.vtQuotaUsed || 0} / {integration?.vtQuotaLimit || 500}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
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
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">API Key</p>
                <p className="text-xs text-slate-500">
                  {hasAbuseKey ? `Configurada (****${integration?.abuseipdbApiKey?.slice(-4)})` : "No configurada"}
                </p>
              </div>
              {hasAbuseKey ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <XCircle className="w-5 h-5 text-slate-400" />
              )}
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">Estado</p>
                <p className="text-xs text-slate-500">
                  {abuseEnabled ? "Consultas automaticas activas" : "Desactivado"}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                abuseEnabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
              }`}>
                {abuseEnabled ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500">Cuota utilizada</span>
                <span className="font-medium text-slate-900">
                  {integration?.abuseQuotaUsed || 0} / {integration?.abuseQuotaLimit || 1000}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
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

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex gap-4">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-blue-900">Configuracion de API Keys</p>
          <p className="text-sm text-blue-700 mt-1">
            Las API Keys se configuran via variables de entorno. Establece <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">VIRUSTOTAL_API_KEY</code> y <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">ABUSEIPDB_API_KEY</code> en tu archivo <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">.env</code>
          </p>
        </div>
      </div>
    </div>
  )
}
