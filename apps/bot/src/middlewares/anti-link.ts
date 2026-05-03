import { Bot } from "grammy"
import { prisma } from "@schrodinger/database"
import { getGroupPolicy } from "../database/client.js"
import { extractUrls } from "@schrodinger/shared"
import { threatIntel } from "@schrodinger/threat-intel"

export function registerAntiLinkMiddleware(bot: Bot) {
  bot.on("message:text", async (ctx, next) => {
    if (!ctx.chat || ctx.chat.type === "private") {
      return next()
    }

    const chatId = ctx.chat.id
    const policy = await getGroupPolicy(BigInt(chatId))

    if (!policy.antiLink) {
      return next()
    }

    const text = ctx.message.text
    const urls = extractUrls(text)

    if (urls.length === 0) {
      return next()
    }

    const group = await prisma.group.findUnique({
      where: { telegramId: BigInt(chatId) },
      include: { whitelistedUrls: true, blacklistedUrls: true },
    })

    if (!group) return next()

    for (const url of urls) {
      const normalizedUrl = url.toLowerCase().split("/")[2] || url.toLowerCase()

      const isWhitelisted = group.whitelistedUrls.some(
        (wu) => wu.url.toLowerCase().includes(normalizedUrl) || normalizedUrl.includes(wu.url.toLowerCase())
      )

      if (isWhitelisted) {
        continue
      }

      const isBlacklisted = group.blacklistedUrls.some(
        (bu) => bu.url.toLowerCase().includes(normalizedUrl) || normalizedUrl.includes(bu.url.toLowerCase())
      )

      if (isBlacklisted) {
        try {
          await ctx.deleteMessage()
        } catch {}

        await prisma.log.create({
          data: {
            groupId: group.id,
            actionType: "LINK_BLOCKED",
            details: `Blacklisted URL: ${url}`,
          },
        })

        await ctx.reply(`🚫 Enlace bloqueado: dominio en lista negra.`, {
          reply_to_message_id: ctx.message.message_id,
        })
        return
      }

      if (policy.vtEnabled) {
        const result = await threatIntel.virustotal.scanUrl(url)
        if (result && result.isMalicious) {
          try {
            await ctx.deleteMessage()
          } catch {}

          await prisma.log.create({
            data: {
              groupId: group.id,
              actionType: "LINK_BLOCKED",
              details: `Malicious URL detected: ${url} (score: ${result.score}%)`,
            },
          })

          const warnLimit = policy.warnLimit
          const currentWarns = await prisma.warn.count({
            where: {
              userId: String(ctx.from?.id),
              groupId: group.id,
              isActive: true,
            },
          })

          if (currentWarns + 1 >= warnLimit && policy.autoBanOnWarn) {
            try {
              await ctx.api.banChatMember(chatId, ctx.from!.id)
            } catch {}
          }

          await ctx.reply(`🔴 Enlace malicioso detectado y eliminado.`, {
            reply_to_message_id: ctx.message.message_id,
          })
          return
        }
      }
    }

    return next()
  })
}
