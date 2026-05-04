import { Bot, Context } from "grammy"
import { MESSAGES } from "@schrodinger/shared"
import { getOrCreateUser, getGroupPolicy } from "../database/client.js"

export function registerBasicCommands(bot: Bot) {
  bot.command("start", async (ctx) => {
    if (!ctx.from) return
    await getOrCreateUser(
      BigInt(ctx.from.id),
      ctx.from.username || undefined,
      ctx.from.first_name || undefined
    )
    await ctx.reply(MESSAGES.WELCOME, { parse_mode: "MarkdownV2" })
  })

  bot.command("help", async (ctx) => {
    await ctx.reply(MESSAGES.HELP, { parse_mode: "MarkdownV2" })
  })

  bot.command("ping", async (ctx) => {
    const start = Date.now()
    const msg = await ctx.reply("Pinging...")
    const latency = Date.now() - start
    await ctx.api.editMessageText(msg.chat.id, msg.message_id, `Pong! Latency: ${latency}ms`)
  })

  bot.command("settings", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") {
      await ctx.reply("Este comando solo funciona en grupos.")
      return
    }

    const policy = await getGroupPolicy(BigInt(ctx.chat.id))

    const text = [
      "⚙️ *Configuración del grupo*",
      "",
      `🛡️ Anti-Flood: ${policy.antiFlood ? "✅" : "❌"}`,
      `🔗 Anti-Link: ${policy.antiLink ? "✅" : "❌"}`,
      `↪️ Anti-Forward: ${policy.antiForward ? "✅" : "❌"}`,
      `🗑️ Anti-Spam: ${policy.antiSpam ? "✅" : "❌"}`,
      "",
      `⚠️ Límite de warns: ${policy.warnLimit}`,
      `🔇 Duración de mute: ${policy.muteDuration}min`,
      `🌊 Flood limit: ${policy.floodLimit} msgs / ${policy.floodInterval}ms`,
      `🔬 VirusTotal: ${policy.vtEnabled ? "✅" : "❌"}`,
      `🛡️ AbuseIPDB: ${policy.abuseEnabled ? "✅" : "❌"}`,
    ].join("\n")

    await ctx.reply(text, { parse_mode: "Markdown" })
  })
}
