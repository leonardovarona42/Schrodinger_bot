import { prisma } from "@schrodinger/database"
import { Card } from "@/components/ui"
import { Shield, Check, X } from "lucide-react"

export default async function PoliciesPage() {
  const policies = await prisma.policy.findMany({
    include: { group: true },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Politicas de Seguridad</h1>
        <p className="text-slate-500 mt-1">Configuracion de reglas de moderacion por grupo</p>
      </div>

      {policies.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No hay politicas configuradas</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              Las politicas se crean automaticamente al agregar el bot a un grupo
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6">
          {policies.map((policy) => (
            <Card key={policy.id} title={policy.group.name || `Grupo ${policy.group.telegramId}`}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <Toggle label="Anti-Flood" enabled={policy.antiFlood} />
                <Toggle label="Anti-Link" enabled={policy.antiLink} />
                <Toggle label="Anti-Forward" enabled={policy.antiForward} />
                <Toggle label="Anti-Spam" enabled={policy.antiSpam} />
                <Toggle label="Captcha Join" enabled={policy.captchaOnJoin} />
                <Toggle label="Auto-Ban" enabled={policy.autoBanOnWarn} />
                <Toggle label="VirusTotal" enabled={policy.vtEnabled} />
                <Toggle label="AbuseIPDB" enabled={policy.abuseEnabled} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Limite Warns</p>
                  <p className="text-lg font-semibold text-slate-900">{policy.warnLimit}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Duracion Mute</p>
                  <p className="text-lg font-semibold text-slate-900">{policy.muteDuration} min</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Flood Limit</p>
                  <p className="text-lg font-semibold text-slate-900">{policy.floodLimit} msgs</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Sensibilidad</p>
                  <p className="text-lg font-semibold text-slate-900 capitalize">{policy.spamSensitivity}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function Toggle({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
        enabled ? "bg-emerald-100" : "bg-slate-200"
      }`}>
        {enabled ? (
          <Check className="w-3 h-3 text-emerald-600" />
        ) : (
          <X className="w-3 h-3 text-slate-400" />
        )}
      </div>
    </div>
  )
}
