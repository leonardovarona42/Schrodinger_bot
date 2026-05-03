import { Bot } from "grammy"
import { prisma, Policy } from "@schrodinger/database"
import { PolicyConfig } from "@schrodinger/shared"

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || "")

export async function getGroupPolicy(chatId: bigint): Promise<PolicyConfig> {
  let policy = await prisma.policy.findUnique({
    where: { groupId: String(chatId) },
  })

  if (!policy) {
    policy = await prisma.policy.create({
      data: {
        group: {
          connectOrCreate: {
            where: { telegramId: chatId },
            create: { telegramId: chatId },
          },
        },
        antiFlood: true,
        antiLink: true,
        antiForward: false,
        antiSpam: true,
        captchaOnJoin: false,
        warnLimit: Number(process.env.DEFAULT_WARN_LIMIT) || 3,
        muteDuration: Number(process.env.DEFAULT_MUTE_MINUTES) || 15,
        floodLimit: Number(process.env.FLOOD_LIMIT) || 5,
        floodInterval: Number(process.env.FLOOD_INTERVAL) || 3000,
        autoBanOnWarn: true,
        spamSensitivity: "medium",
        vtEnabled: process.env.VT_ENABLED === "true",
        abuseEnabled: process.env.ABUSE_ENABLED === "true",
      },
      include: { group: true },
    })
  }

  return {
    antiFlood: policy.antiFlood,
    antiLink: policy.antiLink,
    antiForward: policy.antiForward,
    antiSpam: policy.antiSpam,
    captchaOnJoin: policy.captchaOnJoin,
    warnLimit: policy.warnLimit,
    muteDuration: policy.muteDuration,
    floodLimit: policy.floodLimit,
    floodInterval: policy.floodInterval,
    autoBanOnWarn: policy.autoBanOnWarn,
    spamSensitivity: policy.spamSensitivity as "low" | "medium" | "high",
    groupRules: policy.groupRules || undefined,
    vtEnabled: policy.vtEnabled,
    abuseEnabled: policy.abuseEnabled,
  }
}

export async function getOrCreateUser(telegramId: bigint, username?: string, name?: string) {
  return prisma.user.upsert({
    where: { telegramId },
    update: { username: username || undefined, name: name || undefined },
    create: { telegramId, username: username || undefined, name: name || undefined, role: "MODERATOR" },
  })
}
