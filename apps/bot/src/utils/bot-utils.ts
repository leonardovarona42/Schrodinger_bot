import { Context } from "grammy"
import { prisma } from "@schrodinger/database"
import { MODERATOR_ROLES, ADMIN_ROLES } from "@schrodinger/shared"

export async function hasModPermission(ctx: Context): Promise<boolean> {
  if (!ctx.from) return false
  const user = await prisma.user.findUnique({ where: { telegramId: BigInt(ctx.from.id) } })
  if (!user) return false
  return MODERATOR_ROLES.includes(user.role as any)
}

export async function hasAdminPermission(ctx: Context): Promise<boolean> {
  if (!ctx.from) return false
  const user = await prisma.user.findUnique({ where: { telegramId: BigInt(ctx.from.id) } })
  if (!user) return false
  return ADMIN_ROLES.includes(user.role as any)
}

export async function getGroupFromCtx(ctx: Context) {
  if (!ctx.chat || ctx.chat.type === "private") return null
  return prisma.group.findUnique({ where: { telegramId: BigInt(ctx.chat.id) } })
}

export async function getUserFromCtx(ctx: Context) {
  if (!ctx.from) return null
  return prisma.user.findUnique({ where: { telegramId: BigInt(ctx.from.id) } })
}
