import { Bot, Context } from "grammy"
import { prisma } from "@schrodinger/database"
import { MESSAGES, getOrCreateUser } from "../database/client.js"
import { extractUrls } from "@schrodinger/shared"

const MODERATOR_ROLES = ["SUPER_ADMIN", "OWNER", "ADMIN", "MODERATOR"]

async function hasModPermission(ctx: Context): Promise<boolean> {
  if (!ctx.from) return false
  const user = await prisma.user.findUnique({ where: { telegramId: BigInt(ctx.from.id) } })
  if (!user) return false
  return MODERATOR_ROLES.includes(user.role)
}

function parseUserTarget(text: string): { userId: number | null; reason: string } {
  const reply = text.split("\n")[0].trim()
  const replyMatch = text.match(/^\/\w+\s+@?(\w+)/)

  if (replyMatch) {
    return { userId: null, reason: text.slice(replyMatch[0].length).trim() }
  }

  return { userId: null, reason: text }
}

export function registerModerationCommands(bot: Bot) {
  bot.command("warn", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return

    const hasPermission = await hasModPermission(ctx)
    if (!hasPermission) {
      await ctx.reply("No tienes permisos para ejecutar este comando.")
      return
    }

    const reply = ctx.message?.reply_to_message
    const replyUser = reply?.from

    if (!replyUser) {
      await ctx.reply("Responde a un mensaje para advertir al usuario.")
      return
    }

    const reason = ctx.match?.trim() || "Sin motivo especificado"

    await getOrCreateUser(replyUser.id, replyUser.username || undefined, replyUser.first_name || undefined)
    const targetUser = await prisma.user.findUnique({ where: { telegramId: replyUser.id } })
    const group = await prisma.group.findUnique({ where: { telegramId: BigInt(ctx.chat.id) } })

    if (!targetUser || !group) {
      await ctx.reply("Error al registrar la advertencia.")
      return
    }

    const warn = await prisma.warn.create({
      data: {
        userId: targetUser.id,
        groupId: group.id,
        reason,
        createdById: ctx.from?.id ? String(ctx.from.id) : undefined,
      },
    })

    const warnCount = await prisma.warn.count({
      where: { userId: targetUser.id, groupId: group.id, isActive: true },
    })

    const policy = await prisma.policy.findUnique({ where: { groupId: group.id } })

    let response = `⚠️ *${replyUser.first_name}* ha sido advertido (${warnCount} warns)\nMotivo: ${reason}`

    if (policy?.autoBanOnWarn && warnCount >= policy.warnLimit) {
      try {
        await ctx.api.banChatMember(ctx.chat.id, replyUser.id)
        response += "\n🚫 Baneado automáticamente por alcanzar el límite de warns."
      } catch {
        response += "\n⚠️ No se pudo banear al usuario."
      }
    }

    await prisma.log.create({
      data: {
        groupId: group.id,
        actionType: "WARN",
        details: reason,
        metadata: { warnCount, autoBan: policy?.autoBanOnWarn && warnCount >= policy.warnLimit },
      },
    })

    await ctx.reply(response, { parse_mode: "Markdown" })
  })

  bot.command("mute", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return

    const hasPermission = await hasModPermission(ctx)
    if (!hasPermission) {
      await ctx.reply("No tienes permisos para ejecutar este comando.")
      return
    }

    const reply = ctx.message?.reply_to_message
    const replyUser = reply?.from

    if (!replyUser) {
      await ctx.reply("Responde a un mensaje para silenciar al usuario.")
      return
    }

    const duration = parseInt(ctx.match || "15", 10) || 15
    const untilDate = Math.floor(Date.now() / 1000) + duration * 60

    try {
      await ctx.api.restrictChatMember(ctx.chat.id, replyUser.id, {
        can_send_messages: false,
        can_send_audios: false,
        can_send_documents: false,
        can_send_photos: false,
        can_send_videos: false,
        can_send_video_notes: false,
        can_send_voice_notes: false,
        can_send_polls: false,
        can_send_other_messages: false,
        can_add_web_page_previews: false,
        until_date: untilDate,
      })

      const group = await prisma.group.findUnique({ where: { telegramId: BigInt(ctx.chat.id) } })
      if (group) {
        await prisma.log.create({
          data: {
            groupId: group.id,
            actionType: "MUTE",
            details: `Muted for ${duration} minutes`,
            metadata: { duration, targetId: replyUser.id },
          },
        })
      }

      await ctx.reply(`🔇 *${replyUser.first_name}* silenciado por ${duration} minutos.`, {
        parse_mode: "Markdown",
      })
    } catch {
      await ctx.reply("No se pudo silenciar al usuario.")
    }
  })

  bot.command("ban", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return

    const hasPermission = await hasModPermission(ctx)
    if (!hasPermission) {
      await ctx.reply("No tienes permisos para ejecutar este comando.")
      return
    }

    const reply = ctx.message?.reply_to_message
    const replyUser = reply?.from

    if (!replyUser) {
      await ctx.reply("Responde a un mensaje para banear al usuario.")
      return
    }

    const reason = ctx.match?.trim() || "Sin motivo especificado"

    try {
      await ctx.api.banChatMember(ctx.chat.id, replyUser.id)

      const group = await prisma.group.findUnique({ where: { telegramId: BigInt(ctx.chat.id) } })
      if (group) {
        await prisma.log.create({
          data: {
            groupId: group.id,
            actionType: "BAN",
            details: reason,
            metadata: { targetId: replyUser.id },
          },
        })
      }

      await ctx.reply(`🚫 *${replyUser.first_name}* baneado.\nMotivo: ${reason}`, { parse_mode: "Markdown" })
    } catch {
      await ctx.reply("No se pudo banear al usuario.")
    }
  })

  bot.command("kick", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return

    const hasPermission = await hasModPermission(ctx)
    if (!hasPermission) {
      await ctx.reply("No tienes permisos para ejecutar este comando.")
      return
    }

    const reply = ctx.message?.reply_to_message
    const replyUser = reply?.from

    if (!replyUser) {
      await ctx.reply("Responde a un mensaje para expulsar al usuario.")
      return
    }

    try {
      await ctx.api.banChatMember(ctx.chat.id, replyUser.id)
      await ctx.api.unbanChatMember(ctx.chat.id, replyUser.id)

      const group = await prisma.group.findUnique({ where: { telegramId: BigInt(ctx.chat.id) } })
      if (group) {
        await prisma.log.create({
          data: {
            groupId: group.id,
            actionType: "KICK",
            metadata: { targetId: replyUser.id },
          },
        })
      }

      await ctx.reply(`👢 *${replyUser.first_name}* expulsado.`, { parse_mode: "Markdown" })
    } catch {
      await ctx.reply("No se pudo expulsar al usuario.")
    }
  })

  bot.command("unban", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return

    const hasPermission = await hasModPermission(ctx)
    if (!hasPermission) {
      await ctx.reply("No tienes permisos para ejecutar este comando.")
      return
    }

    const reply = ctx.message?.reply_to_message
    const replyUser = reply?.from

    if (!replyUser) {
      await ctx.reply("Responde a un mensaje para desbanear al usuario.")
      return
    }

    try {
      await ctx.api.unbanChatMember(ctx.chat.id, replyUser.id)

      const group = await prisma.group.findUnique({ where: { telegramId: BigInt(ctx.chat.id) } })
      if (group) {
        await prisma.log.create({
          data: {
            groupId: group.id,
            actionType: "UNBAN",
            metadata: { targetId: replyUser.id },
          },
        })
      }

      await ctx.reply(`✅ *${replyUser.first_name}* desbaneado.`, { parse_mode: "Markdown" })
    } catch {
      await ctx.reply("No se pudo desbanear al usuario.")
    }
  })

  bot.command("unmute", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return

    const hasPermission = await hasModPermission(ctx)
    if (!hasPermission) {
      await ctx.reply("No tienes permisos para ejecutar este comando.")
      return
    }

    const reply = ctx.message?.reply_to_message
    const replyUser = reply?.from

    if (!replyUser) {
      await ctx.reply("Responde a un mensaje para desilenciar al usuario.")
      return
    }

    try {
      await ctx.api.restrictChatMember(ctx.chat.id, replyUser.id, {
        can_send_messages: true,
        can_send_audios: true,
        can_send_documents: true,
        can_send_photos: true,
        can_send_videos: true,
        can_send_video_notes: true,
        can_send_voice_notes: true,
        can_send_polls: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
      })

      const group = await prisma.group.findUnique({ where: { telegramId: BigInt(ctx.chat.id) } })
      if (group) {
        await prisma.log.create({
          data: {
            groupId: group.id,
            actionType: "UNMUTE",
            metadata: { targetId: replyUser.id },
          },
        })
      }

      await ctx.reply(`✅ *${replyUser.first_name}* desilenciado.`, { parse_mode: "Markdown" })
    } catch {
      await ctx.reply("No se pudo desilenciar al usuario.")
    }
  })
}
