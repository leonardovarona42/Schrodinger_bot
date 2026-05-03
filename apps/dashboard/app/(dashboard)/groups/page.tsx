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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Grupos</h1>
        <p className="text-slate-500 mt-1">Gestion de comunidades de Telegram</p>
      </div>

      {groups.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No hay grupos registrados</h3>
            <p className="text-slate-500 mt-2">
              Agrega el bot a un grupo de Telegram para comenzar
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {groups.map((group) => (
            <Card key={group.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {group.name || `Grupo ${group.telegramId}`}
                    </h3>
                    <p className="text-sm text-slate-500">ID: {group.telegramId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={group.policy?.antiLink ? "success" : "default"}>
                    Anti-Link
                  </Badge>
                  <Badge variant={group.policy?.antiFlood ? "success" : "default"}>
                    Anti-Flood
                  </Badge>
                  <div className="text-right text-sm text-slate-500">
                    <p>{group._count.warns} warns</p>
                    <p>{group._count.logs} logs</p>
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
