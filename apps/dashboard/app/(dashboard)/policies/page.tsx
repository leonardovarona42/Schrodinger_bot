import { prisma } from "@schrodinger/database"
import { Card, Badge } from "@/components/ui"
import { Shield, Check, X } from "lucide-react"

export default async function PoliciesPage() {
  const policies = await prisma.policy.findMany({
    include: { group: true },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Politicas de Seguridad</h1>
        <p className="text-slate-500 mt-1">Configuracion de reglas de moderacion</p>
      </div>

      {policies.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No hay politicas configuradas</h3>
            <p className="text-slate-500 mt-2">
              Las politicas se crean automaticamente al agregar el bot a un grupo
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {policies.map((policy) => (
            <Card key={policy.id}>
              <div className="mb-4">
                <h3 className="font-semibold text-slate-900">
                  {policy.group.name || `Grupo ${policy.group.telegramId}`}
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <PolicyToggle label="Anti-Flood" enabled={policy.antiFlood} />
                <PolicyToggle label="Anti-Link" enabled={policy.antiLink} />
                <PolicyToggle label="Anti-Forward" enabled={policy.antiForward} />
                <PolicyToggle label="Anti-Spam" enabled={policy.antiSpam} />
                <PolicyToggle label="Captcha Join" enabled={policy.captchaOnJoin} />
                <PolicyToggle label="Auto-Ban" enabled={policy.autoBanOnWarn} />
                <PolicyToggle label="VirusTotal" enabled={policy.vtEnabled} />
                <PolicyToggle label="AbuseIPDB" enabled={policy.abuseEnabled} />
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Limite Warns:</span>
                  <span className="ml-2 font-medium">{policy.warnLimit}</span>
                </div>
                <div>
                  <span className="text-slate-500">Duracion Mute:</span>
                  <span className="ml-2 font-medium">{policy.muteDuration} min</span>
                </div>
                <div>
                  <span className="text-slate-500">Flood Limit:</span>
                  <span className="ml-2 font-medium">{policy.floodLimit} msgs</span>
                </div>
                <div>
                  <span className="text-slate-500">Sensibilidad:</span>
                  <span className="ml-2 font-medium">{policy.spamSensitivity}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function PolicyToggle({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {enabled ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-slate-400" />
      )}
    </div>
  )
}
