import { prisma } from "@schrodinger/database"
import { Card, Badge } from "@/components/ui"
import { ScrollText } from "lucide-react"

const actionTypeColors: Record<string, "default" | "success" | "warning" | "danger"> = {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Logs</h1>
        <p className="text-slate-500 mt-1">Historial de acciones de moderacion</p>
      </div>

      {logs.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <ScrollText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No hay logs registrados</h3>
            <p className="text-slate-500 mt-2">
              Los logs apareceran cuando el bot realice acciones de moderacion
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Accion</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Grupo</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Detalles</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 px-4">
                      <Badge variant={actionTypeColors[log.actionType] || "default"}>
                        {log.actionType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-700">
                      {log.group.name || log.group.telegramId}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500 max-w-xs truncate">
                      {log.details || "-"}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("es-ES")}
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
