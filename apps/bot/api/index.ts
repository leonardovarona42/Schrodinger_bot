import "dotenv/config"
import { Bot, webhookCallback } from "grammy"
import { Hono } from "hono"
import { serve } from "@hono/node-server"

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || "")

const app = new Hono()

app.get("/", (c) => c.text("SchrödingerSec Bot is running"))
app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }))

app.post(`/webhook/${process.env.TELEGRAM_WEBHOOK_SECRET}`, webhookCallback(bot, "hono"))

async function registerCommands() {
  const { registerBasicCommands } = await import("../src/commands/basic.js")
  const { registerModerationCommands } = await import("../src/commands/moderation.js")
  const { registerThreatIntelCommands } = await import("../src/commands/threat-intel.js")

  registerBasicCommands(bot)
  registerModerationCommands(bot)
  registerThreatIntelCommands(bot)

  const { registerFloodMiddleware } = await import("../src/middlewares/flood.js")
  const { registerAntiLinkMiddleware } = await import("../src/middlewares/anti-link.js")
  registerFloodMiddleware(bot)
  registerAntiLinkMiddleware(bot)
}

async function main() {
  await registerCommands()

  if (process.env.NODE_ENV === "production") {
    console.log("Starting bot in webhook mode...")
    const port = parseInt(process.env.PORT || "3001", 10)
    serve({ fetch: app.fetch, port }, (info) => {
      console.log(`Server listening on http://localhost:${info.port}`)
    })
  } else {
    console.log("Starting bot in polling mode...")
    await bot.start({
      onStart: (info) => console.log(`Bot started as @${info.username}`),
    })
  }
}

main().catch(console.error)
