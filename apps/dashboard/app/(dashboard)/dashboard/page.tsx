import { prisma } from "@schrodinger/database"
import { StatCard, Card } from "@/components/ui"
import { Shield, Users, AlertTriangle, Link2 } from "lucide-react"

export default async function DashboardPage() {
  const groups = await prisma.group.count()
  const users = await prisma.user.count()
  const warns = await prisma.warn.count({ where: { isActive: true } })
  const blockedLinks = await prisma.log.count({ where: { actionType: "LINK_BLOCKED" } })
  const recentLogs = await prisma.log.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { group: true },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Resumen de actividad y seguridad</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Grupos Activos"
          value={groups}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Usuarios Registrados"
          value={users}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Warns Activos"
          value={warns}
          icon={<AlertTriangle className="w-6 h-6" />}
          trend={{ value: 5, positive: false }}
        />
        <StatCard
          title="Enlaces Bloqueados"
          value={blockedLinks}
          icon={<Link2 className="w-6 h-6" />}
          trend={{ value: 15, positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Actividad Reciente" description="Ultimos eventos de moderacion">
          <div className="space-y-3">
            {recentLogs.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No hay actividad reciente</p>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <span className="text-sm font-medium text-slate-900">{log.actionType}</span>
                    {log.details && <p className="text-xs text-slate-500 mt-0.5">{log.details}</p>}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">
                      {new Date(log.createdAt).toLocaleTimeString("es-ES")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card title="Estado de Integraciones" description="Servicios de threat intelligence">
          <div className="space-y-4">
            <IntegrationStatus
              name="VirusTotal"
              envKey="VIRUSTOTAL_API_KEY"
              enabledKey="vtEnabled"
            />
            <IntegrationStatus
              name="AbuseIPDB"
              envKey="ABUSEIPDB_API_KEY"
              enabledKey="abuseEnabled"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

function IntegrationStatus({ name, envKey, enabledKey }: { name: string; envKey: string; enabledKey: string }) {
  const envValue = process.env[envKey]
  const isEnabled = process.env[`${enabledKey.toUpperCase()}`] === "true" || !!envValue

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <div>
        <p className="font-medium text-sm text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">
          {envValue ? "API Key configurada" : "Sin API Key"}
        </p>
      </div>
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          isEnabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
        }`}
      >
        {isEnabled ? "Activo" : "Inactivo"}
      </span>
    </div>
  )
}
