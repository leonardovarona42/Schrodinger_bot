import { prisma } from "@schrodinger/database"
import { Card, Badge } from "@/components/ui"
import { ScrollText } from "lucide-react"
import ExportButtons from "@/components/export-buttons"

const actionTypeColors: Record<string, "default" | "success" | "warning" | "danger" | "info"> = {
  WARN: "warning",
  MUTE: "warning",
  BAN: "danger",
  KICK: "danger",
  UNBAN: "success",
  UNMUTE: "success",
  DELETE_MESSAGE: "default",
  BLACKLIST: "danger",
  WHITELIST: "success",
  FLOOD_DETECTED: "warning",
  LINK_BLOCKED: "danger",
  IP_BLOCKED: "danger",
  SYSTEM: "default",
}

export default async function LogsPage() {
  const logs = await prisma.log.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { group: true },
  })

  const exportData = logs.map((log) => ({
    actionType: log.actionType,
    group: log.group.name || `Grupo ${log.group.telegramId}`,
    details: log.details || "",
    date: new Date(log.createdAt).toLocaleString("es-ES"),
  }))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Logs</h1>
          <p className="text-slate-500 mt-1">Historial completo de acciones de moderacion</p>
        </div>
        <div className="flex items-center gap-4">
          <ExportButtons data={exportData} filename="logs" />
          <span className="text-sm text-slate-500">{logs.length} eventos</span>
        </div>
      </div>

      {logs.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <ScrollText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No hay logs registrados</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              Los logs apareceran cuando el bot realice acciones de moderacion en tus grupos
            </p>
          </div>
        </Card>
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Accion</th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Grupo</th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Detalles</th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-6">
                      <Badge variant={actionTypeColors[log.actionType] || "default"}>
                        {log.actionType}
                      </Badge>
                    </td>
                    <td className="py-3 px-6 text-sm text-slate-700">
                      {log.group.name || `Grupo ${log.group.telegramId}`}
                    </td>
                    <td className="py-3 px-6 text-sm text-slate-500 max-w-xs truncate">
                      {log.details || "-"}
                    </td>
                    <td className="py-3 px-6 text-sm text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
