import { prisma } from "@schrodinger/database"
import { Role } from "@schrodinger/shared"

export interface SessionUser {
  id: string
  telegramId: bigint
  username?: string
  role: Role
}

export async function getUserByTelegramId(telegramId: bigint) {
  return prisma.user.findUnique({
    where: { telegramId },
  })
}

export async function createUser(telegramId: bigint, username?: string, name?: string) {
  return prisma.user.create({
    data: {
      telegramId,
      username,
      name,
      role: "MODERATOR",
    },
  })
}

export async function getOrCreateUser(telegramId: bigint, username?: string, name?: string) {
  let user = await getUserByTelegramId(telegramId)
  if (!user) {
    user = await createUser(telegramId, username, name)
  }
  return user
}

export async function checkUserPermission(telegramId: bigint, requiredRole: Role): Promise<boolean> {
  const user = await getUserByTelegramId(telegramId)
  if (!user) return false

  const hierarchy: Record<Role, number> = {
    SUPER_ADMIN: 5,
    OWNER: 4,
    ADMIN: 3,
    MODERATOR: 2,
    VIEWER: 1,
  }

  return hierarchy[user.role] >= hierarchy[requiredRole]
}
