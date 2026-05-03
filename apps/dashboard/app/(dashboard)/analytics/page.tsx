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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">Estadisticas y metricas de seguridad</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div className="space-y-4">
            {actionStats.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">Sin datos disponibles</p>
            ) : (
              actionStats.map((stat) => {
                const percentage = totalLogs > 0 ? Math.round((stat._count / totalLogs) * 100) : 0
                return (
                  <div key={stat.actionType}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{stat.actionType}</span>
                      <span className="text-sm text-slate-500">{stat._count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          stat.actionType.includes("BAN") || stat.actionType.includes("BLOCK")
                            ? "bg-red-500"
                            : stat.actionType.includes("FLOOD") || stat.actionType.includes("WARN")
                            ? "bg-amber-500"
                            : "bg-blue-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>

        <Card title="Resumen de Seguridad" description="Metricas clave del sistema">
          <div className="space-y-3">
            {[
              { label: "Warns activos", value: activeWarns, color: "text-amber-600" },
              { label: "Eventos de flood", value: floodEvents, color: "text-orange-600" },
              { label: "Enlaces bloqueados", value: blockedLinks, color: "text-red-600" },
              { label: "Bans ejecutados", value: bans, color: "text-red-600" },
              { label: "Total de eventos", value: totalLogs, color: "text-blue-600" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">{item.label}</span>
                <span className={`text-xl font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
