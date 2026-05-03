import { prisma } from "@schrodinger/database"
import { StatCard, Card } from "@/components/ui"
import { Shield, Users, AlertTriangle, Link2, Ban, MessageSquare } from "lucide-react"

export default async function DashboardPage() {
  const groups = await prisma.group.count()
  const users = await prisma.user.count()
  const warns = await prisma.warn.count({ where: { isActive: true } })
  const blockedLinks = await prisma.log.count({ where: { actionType: "LINK_BLOCKED" } })
  const bans = await prisma.log.count({ where: { actionType: "BAN" } })
  const floodEvents = await prisma.log.count({ where: { actionType: "FLOOD_DETECTED" } })
  const recentLogs = await prisma.log.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { group: true },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Resumen de actividad y seguridad</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          title="Grupos Activos"
          value={groups}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Usuarios"
          value={users}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Warns Activos"
          value={warns}
          icon={<AlertTriangle className="w-6 h-6" />}
        />
        <StatCard
          title="Enlaces Bloqueados"
          value={blockedLinks}
          icon={<Link2 className="w-6 h-6" />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
            <Ban className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Bans</p>
            <p className="text-2xl font-bold text-slate-900">{bans}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Floods</p>
            <p className="text-2xl font-bold text-slate-900">{floodEvents}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Eventos</p>
            <p className="text-2xl font-bold text-slate-900">{bans + blockedLinks + floodEvents + warns}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Actividad Reciente" description="Ultimos eventos de moderacion">
          <div className="space-y-0">
            {recentLogs.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No hay actividad reciente</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${
                        log.actionType.includes("BLOCK") ? "bg-red-500" :
                        log.actionType === "FLOOD_DETECTED" ? "bg-amber-500" :
                        log.actionType === "BAN" ? "bg-red-500" :
                        "bg-blue-500"
                      }`} />
                      <div>
                        <span className="text-sm font-medium text-slate-900">{log.actionType}</span>
                        {log.details && <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{log.details}</p>}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                      {new Date(log.createdAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card title="Estado de Integraciones" description="Servicios de threat intelligence">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-sm text-slate-900">VirusTotal</p>
                <p className="text-xs text-slate-500 mt-0.5">Escaneo de URLs maliciosas</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                process.env.VT_ENABLED === "true" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
              }`}>
                {process.env.VT_ENABLED === "true" ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-sm text-slate-900">AbuseIPDB</p>
                <p className="text-xs text-slate-500 mt-0.5">Verificacion de reputacion de IPs</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                process.env.ABUSE_ENABLED === "true" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
              }`}>
                {process.env.ABUSE_ENABLED === "true" ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
