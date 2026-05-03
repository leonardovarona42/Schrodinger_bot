import { prisma } from "@schrodinger/database"
import { Card, Badge } from "@/components/ui"
import { Users, Shield } from "lucide-react"

export default async function GroupsPage() {
  const groups = await prisma.group.findMany({
    include: {
      policy: true,
      _count: {
        select: { warns: true, logs: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Grupos</h1>
          <p className="text-slate-500 mt-1">Gestion de comunidades de Telegram</p>
        </div>
        <span className="text-sm text-slate-500">{groups.length} grupos</span>
      </div>

      {groups.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No hay grupos registrados</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              Agrega el bot a un grupo de Telegram para comenzar. El grupo se registrara automaticamente.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {groups.map((group) => (
            <Card key={group.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {group.name || `Grupo ${group.telegramId}`}
                    </h3>
                    <p className="text-sm text-slate-500">ID: {group.telegramId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={group.policy?.antiLink ? "success" : "default"}>
                    Anti-Link
                  </Badge>
                  <Badge variant={group.policy?.antiFlood ? "success" : "default"}>
                    Anti-Flood
                  </Badge>
                  <Badge variant={group.policy?.vtEnabled ? "info" : "default"}>
                    VirusTotal
                  </Badge>
                  <div className="w-px h-6 bg-slate-200 mx-2" />
                  <div className="text-right text-sm">
                    <p className="text-slate-900 font-medium">{group._count.warns}</p>
                    <p className="text-slate-500 text-xs">warns</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-slate-900 font-medium">{group._count.logs}</p>
                    <p className="text-slate-500 text-xs">logs</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
