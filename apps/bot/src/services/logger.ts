import { prisma, ActionType } from "@schrodinger/database"

export interface LogEntry {
  groupId: string
  actionType: ActionType
  actorId?: string
  targetId?: string
  details?: string
  metadata?: Record<string, unknown>
}

export async function createLog(entry: LogEntry) {
  return prisma.log.create({
    data: {
      groupId: entry.groupId,
      actionType: entry.actionType,
      actorId: entry.actorId,
      targetId: entry.targetId,
      details: entry.details,
      metadata: entry.metadata as any,
    },
  })
}

export async function getGroupLogs(groupId: string, limit = 50) {
  return prisma.log.findMany({
    where: { groupId },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export async function getLogsByActionType(groupId: string, actionType: ActionType, limit = 50) {
  return prisma.log.findMany({
    where: { groupId, actionType },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export async function getLogsStats(groupId: string) {
  const stats = await prisma.log.groupBy({
    by: ["actionType"],
    where: { groupId },
    _count: true,
  })

  const result: Record<string, number> = {}
  for (const stat of stats) {
    result[stat.actionType] = stat._count
  }
  return result
}
