import { prisma } from "@schrodinger/database"
import { createLog } from "./logger.js"

export interface WarnOptions {
  userId: string
  groupId: string
  reason: string
  creatorId?: string
}

export interface WarnResult {
  warnCount: number
  shouldBan: boolean
  warnLimit: number
}

export async function addWarn(options: WarnOptions): Promise<WarnResult> {
  const group = await prisma.group.findUnique({
    where: { id: options.groupId },
    include: { policy: true },
  })

  if (!group) {
    throw new Error("Group not found")
  }

  const warn = await prisma.warn.create({
    data: {
      userId: options.userId,
      groupId: options.groupId,
      reason: options.reason,
      createdById: options.creatorId,
    },
  })

  const warnCount = await prisma.warn.count({
    where: {
      userId: options.userId,
      groupId: options.groupId,
      isActive: true,
    },
  })

  const warnLimit = group.policy?.warnLimit ?? 3
  const shouldBan = (group.policy?.autoBanOnWarn ?? true) && warnCount >= warnLimit

  if (shouldBan) {
    await prisma.warn.updateMany({
      where: { userId: options.userId, groupId: options.groupId, isActive: true },
      data: { isActive: false },
    })
  }

  await createLog({
    groupId: options.groupId,
    actionType: "WARN",
    actorId: options.creatorId,
    targetId: options.userId,
    details: options.reason,
    metadata: { warnCount, shouldBan },
  })

  return { warnCount, shouldBan, warnLimit }
}

export async function clearWarns(userId: string, groupId: string) {
  await prisma.warn.updateMany({
    where: { userId, groupId, isActive: true },
    data: { isActive: false },
  })
}

export async function getUserWarnCount(userId: string, groupId: string): Promise<number> {
  return prisma.warn.count({
    where: { userId, groupId, isActive: true },
  })
}

export async function getGroupWarns(groupId: string) {
  return prisma.warn.findMany({
    where: { groupId, isActive: true },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  })
}
