import { Bot, Context } from "grammy"
import { prisma } from "@schrodinger/database"
import { getGroupPolicy } from "../database/client.js"

interface FloodTracker {
  timestamps: number[]
  mutedUntil?: number
}

const floodMap = new Map<string, FloodTracker>()

export function registerFloodMiddleware(bot: Bot) {
  bot.use(async (ctx, next) => {
    if (!ctx.chat || ctx.chat.type === "private") {
      return next()
    }

    const chatId = ctx.chat.id
    const userId = ctx.from?.id
    const now = Date.now()

    if (!userId) return next()

    const key = `${chatId}:${userId}`
    const policy = await getGroupPolicy(BigInt(chatId))

    if (!policy.antiFlood) {
      return next()
    }

    let tracker = floodMap.get(key)

    if (!tracker) {
      tracker = { timestamps: [] }
      floodMap.set(key, tracker)
    }

    const cutoff = now - policy.floodInterval
    tracker.timestamps = tracker.timestamps.filter((t) => t > cutoff)
    tracker.timestamps.push(now)

    if (tracker.timestamps.length > policy.floodLimit) {
      const group = await prisma.group.findUnique({ where: { telegramId: BigInt(chatId) } })
      if (group) {
        await prisma.log.create({
          data: {
            groupId: group.id,
            actionType: "FLOOD_DETECTED",
            details: `Flood detected: ${tracker.timestamps.length} messages in ${policy.floodInterval}ms`,
            metadata: { userId, messageCount: tracker.timestamps.length },
          },
        })
      }

      try {
        await ctx.deleteMessage()
      } catch {
      }

      const muteDuration = policy.muteDuration
      const untilDate = Math.floor(Date.now() / 1000) + muteDuration * 60

      try {
        await ctx.api.restrictChatMember(chatId, userId, {
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
      } catch {
      }

      floodMap.delete(key)
      return
    }

    return next()
  })

  setInterval(() => {
    const now = Date.now()
    for (const [key, tracker] of floodMap.entries()) {
      const cutoff = now - 60000
      tracker.timestamps = tracker.timestamps.filter((t) => t > cutoff)
      if (tracker.timestamps.length === 0) {
        floodMap.delete(key)
      }
    }
  }, 30000)
}
