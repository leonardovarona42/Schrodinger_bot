import { prisma } from "@schrodinger/database"
import { Card, StatCard } from "@/components/ui"
import { BarChart3, Shield, AlertTriangle, Link2 } from "lucide-react"

export default async function AnalyticsPage() {
  const totalLogs = await prisma.log.count()
  const warns = await prisma.warn.count()
  const bans = await prisma.log.count({ where: { actionType: "BAN" } })
  const blockedLinks = await prisma.log.count({ where: { actionType: "LINK_BLOCKED" } })
  const floodEvents = await prisma.log.count({ where: { actionType: "FLOOD_DETECTED" } })
  const activeWarns = await prisma.warn.count({ where: { isActive: true } })

  const actionStats = await prisma.log.groupBy({
    by: ["actionType"],
    _count: true,
    orderBy: { _count: "desc" },
    take: 10,
  })

  const recentActivity = await prisma.log.groupBy({
    by: ["createdAt"],
    _count: true,
    orderBy: { createdAt: "desc" },
    take: 7,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">Estadisticas y metricas de seguridad</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Eventos"
          value={totalLogs}
          icon={<BarChart3 className="w-6 h-6" />}
        />
        <StatCard
          title="Warns Totales"
          value={warns}
          icon={<AlertTriangle className="w-6 h-6" />}
        />
        <StatCard
          title="Bans"
          value={bans}
          icon={<Shield className="w-6 h-6" />}
        />
        <StatCard
          title="Enlaces Bloqueados"
          value={blockedLinks}
          icon={<Link2 className="w-6 h-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Distribucion de Acciones" description="Acciones de moderacion por tipo">
          <div className="space-y-3">
            {actionStats.map((stat) => {
              const percentage = totalLogs > 0 ? Math.round((stat._count / totalLogs) * 100) : 0
              return (
                <div key={stat.actionType}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{stat.actionType}</span>
                    <span className="text-sm text-slate-500">{stat._count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
            {actionStats.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">Sin datos</p>
            )}
          </div>
        </Card>

        <Card title="Resumen de Seguridad" description="Metricas clave">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Warns activos</span>
              <span className="text-lg font-semibold text-slate-900">{activeWarns}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Eventos de flood</span>
              <span className="text-lg font-semibold text-slate-900">{floodEvents}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Enlaces bloqueados</span>
              <span className="text-lg font-semibold text-slate-900">{blockedLinks}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Bans ejecutados</span>
              <span className="text-lg font-semibold text-slate-900">{bans}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
