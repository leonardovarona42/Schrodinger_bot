import { Bot, Context } from "grammy"
import { threatIntel } from "@schrodinger/threat-intel"
import { prisma } from "@schrodinger/database"
import { extractUrls, extractIPs, isSSRFProtected, isPrivateIP } from "@schrodinger/shared"
import { hasModPermission, getGroupFromCtx } from "../utils/bot-utils"
import { PolicySchema } from "@schrodinger/shared"

export function registerThreatIntelCommands(bot: Bot) {
  bot.command("scanlink", async (ctx) => {
    let urlToScan = ctx.match?.trim()

    if (!urlToScan) {
      const reply = ctx.message?.reply_to_message
      if (reply?.text) {
        const urls = extractUrls(reply.text)
        if (urls.length > 0) {
          urlToScan = urls[0]
        }
      }
    }

    if (!urlToScan) {
      await ctx.reply("Uso: /scanlink <url> o responde a un mensaje con un enlace.")
      return
    }

    if (!urlToScan.startsWith("http")) {
      urlToScan = `https://${urlToScan}`
    }

    if (!isSSRFProtected(urlToScan)) {
      await ctx.reply("Enlace no permitido. No se pueden escanear direcciones privadas o locales.")
      return
    }

    const msg = await ctx.reply("🔬 Escaneando enlace con VirusTotal...")

    const result = await threatIntel.virustotal.scanUrl(urlToScan)

    if (!result) {
      await ctx.api.editMessageText(msg.chat.id, msg.message_id, "No se pudo escanear el enlace. Verifica que VirusTotal esté habilitado.")
      return
    }

    const icon = result.isMalicious ? "🔴" : "🟢"
    const text = [
      `${icon} *Resultado del escaneo*`,
      ``,
      `URL: \`${urlToScan}\``,
      `Score: ${result.score}%`,
      `Fuente: VirusTotal`,
      ``,
      `Detalles: ${result.details}`,
      result.permalink ? `[Ver en VirusTotal](${result.permalink})` : "",
    ].join("\n")

    await ctx.api.editMessageText(msg.chat.id, msg.message_id, text, {
      parse_mode: "Markdown"
    })
  })

  bot.command("scanip", async (ctx) => {
    let ipToScan = ctx.match?.trim()

    if (!ipToScan) {
      const reply = ctx.message?.reply_to_message
      if (reply?.text) {
        const ips = extractIPs(reply.text)
        if (ips.length > 0) {
          ipToScan = ips[0]
        }
      }
    }

     if (!ipToScan) {
       await ctx.reply("Uso: /scanip <ip> o responde a un mensaje con una dirección IP.")
       return
     }

    if (isPrivateIP(ipToScan)) {
      await ctx.reply("Dirección IP privada no permitida para escaneo.")
      return
    }

    const msg = await ctx.reply("🔍 Verificando IP con AbuseIPDB...")

    const result = await threatIntel.abuseipdb.checkIp(ipToScan)

    if (!result) {
      await ctx.api.editMessageText(msg.chat.id, msg.message_id, "No se pudo verificar la IP. Verifica que AbuseIPDB esté habilitado.")
      return
    }

    const icon = result.isMalicious ? "🔴" : "🟢"
    const text = [
      `${icon} *Resultado del escaneo*`,
      ``,
      `IP: \`${ipToScan}\``,
      `Score: ${result.score}%`,
      `Fuente: AbuseIPDB`,
      ``,
      `Detalles: ${result.details}`,
      result.permalink ? `[Ver en AbuseIPDB](${result.permalink})` : "",
    ].join("\n")

    await ctx.api.editMessageText(msg.chat.id, msg.message_id, text, {
      parse_mode: "Markdown",
    })
  })

  bot.command("threatcheck", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") {
      await ctx.reply("Este comando solo funciona en grupos.")
      return
    }

    const group = await prisma.group.findUnique({
      where: { telegramId: BigInt(ctx.chat.id) },
      include: { logs: { orderBy: { createdAt: "desc" }, take: 50 } },
    })

    if (!group) {
      await ctx.reply("Grupo no registrado.")
      return
    }

    const totalLogs = await prisma.log.count({ where: { groupId: group.id } })
    const blockedLinks = await prisma.log.count({ where: { groupId: group.id, actionType: "LINK_BLOCKED" } })
    const floodDetected = await prisma.log.count({ where: { groupId: group.id, actionType: "FLOOD_DETECTED" } })
    const warns = await prisma.warn.count({ where: { groupId: group.id, isActive: true } })

    const text = [
      "🛡️ *Resumen de amenazas del grupo*",
      ``,
      `Total de eventos: ${totalLogs}`,
      `Enlaces bloqueados: ${blockedLinks}`,
      `Floods detectados: ${floodDetected}`,
      `Warns activos: ${warns}`,
    ].join("\n")

    await ctx.reply(text, { parse_mode: "Markdown" })
  })

  bot.command("blacklist", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return

    const url = ctx.match?.trim()
    if (!url) {
      await ctx.reply("Uso: /blacklist <url>")
      return
    }

    const group = await prisma.group.findUnique({ where: { telegramId: BigInt(ctx.chat.id) } })
    if (!group) return

    try {
      await prisma.blacklistedUrl.create({
        data: { groupId: group.id, url, reason: "Añadido manualmente" },
      })

      await prisma.log.create({
        data: {
          groupId: group.id,
          actionType: "BLACKLIST",
          details: url,
        },
      })

      await ctx.reply(`✅ \`${url}\` añadida a la lista negra.`, { parse_mode: "Markdown" })
    } catch {
      await ctx.reply("La URL ya está en la lista negra.")
    }
  })

  bot.command("blacklist_rm", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return

    const url = ctx.match?.trim()
    if (!url) {
      await ctx.reply("Uso: /blacklist_rm <url>")
      return
    }

    const group = await prisma.group.findUnique({ where: { telegramId: BigInt(ctx.chat.id) } })
    if (!group) return

    await prisma.blacklistedUrl.deleteMany({
      where: { groupId: group.id, url },
    })

    await ctx.reply(`✅ \`${url}\` eliminada de la lista negra.`, { parse_mode: "Markdown" })
  })

  bot.command("whitelist", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return

    const url = ctx.match?.trim()
    if (!url) {
      await ctx.reply("Uso: /whitelist <url>")
      return
    }

    const group = await prisma.group.findUnique({ where: { telegramId: BigInt(ctx.chat.id) } })
    if (!group) return

    try {
      await prisma.whitelistedUrl.create({
        data: { groupId: group.id, url },
      })

      await ctx.reply(`✅ \`${url}\` añadida a la lista blanca.`, { parse_mode: "Markdown" })
    } catch {
      await ctx.reply("La URL ya está en la lista blanca.")
    }
  })

  bot.command("whitelist_rm", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return

    const url = ctx.match?.trim()
    if (!url) {
      await ctx.reply("Uso: /whitelist_rm <url>")
      return
    }

    const group = await prisma.group.findUnique({ where: { telegramId: BigInt(ctx.chat.id) } })
    if (!group) return

    await prisma.whitelistedUrl.deleteMany({
      where: { groupId: group.id, url },
    })

    await ctx.reply(`✅ \`${url}\` eliminada de la lista blanca.`, { parse_mode: "Markdown" })
  })

  bot.command("policy", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return

    const group = await prisma.group.findUnique({
      where: { telegramId: BigInt(ctx.chat.id) },
      include: { policy: true, blacklistedUrls: true, whitelistedUrls: true },
    })

    if (!group) {
      await ctx.reply("Grupo no registrado.")
      return
    }

    const p = group.policy
    const text = [
      "📋 *Políticas del grupo*",
      ``,
      `Anti-Flood: ${p?.antiFlood ? "✅" : "❌"}`,
      `Anti-Link: ${p?.antiLink ? "✅" : "❌"}`,
      `Anti-Forward: ${p?.antiForward ? "✅" : "❌"}`,
      `Anti-Spam: ${p?.antiSpam ? "✅" : "❌"}`,
      ``,
      `Límite warns: ${p?.warnLimit || 3}`,
      `Duración mute: ${p?.muteDuration || 15}min`,
      `Flood: ${p?.floodLimit || 5} msgs`,
      `Auto-ban on warns: ${p?.autoBanOnWarn ? "✅" : "❌"}`,
      ``,
      `🔬 VirusTotal: ${p?.vtEnabled ? "✅" : "❌"}`,
      `🛡️ AbuseIPDB: ${p?.abuseEnabled ? "✅" : "❌"}`,
      ``,
      `⬛ URLs bloqueadas: ${group.blacklistedUrls.length}`,
      `⬜ URLs permitidas: ${group.whitelistedUrls.length}`,
    ].join("\n")

    await ctx.reply(text, { parse_mode: "Markdown" })
  })

  bot.command("policy_set", async (ctx) => {
    if (!ctx.chat || ctx.chat.type === "private") return

    const hasPermission = await hasModPermission(ctx)
    if (!hasPermission) {
      await ctx.reply("No tienes permisos para ejecutar este comando.")
      return
    }

    const match = ctx.match?.trim()
    if (!match) {
      await ctx.reply("Uso: /policy_set <clave> <valor>\nEjemplos:\n/policy_set anti_flood on\n/policy_set warn_limit 5")
      return
    }

    const [key, value] = match.split(/\s+/)
    const group = await getGroupFromCtx(ctx)
    if (!group) return

    let policy = await prisma.policy.findUnique({ where: { groupId: group.id } })
    if (!policy) {
      policy = await prisma.policy.create({
        data: {
          group: { connect: { id: group.id } },
          warnLimit: 3,
          muteDuration: 15,
          floodLimit: 5,
          floodInterval: 3000,
        },
      })
    }

    const boolValues: Record<string, boolean> = { on: true, off: false, true: true, false: false, si: true, no: false }
    const isBool = value.toLowerCase() in boolValues
    const parsedValue = isBool ? boolValues[value.toLowerCase()] : parseInt(value, 10)

    const updateData: any = {}

    switch (key.toLowerCase()) {
      case "anti_flood":
      case "antiflood":
        updateData.antiFlood = parsedValue
        break
      case "anti_link":
      case "antilink":
        updateData.antiLink = parsedValue
        break
      case "anti_forward":
      case "antiforward":
        updateData.antiForward = parsedValue
        break
      case "anti_spam":
      case "antispam":
        updateData.antiSpam = parsedValue
        break
      case "warn_limit":
      case "warnlimit": {
        const result = PolicySchema.shape.warnLimit.safeParse(parsedValue)
        if (!result.success) {
          await ctx.reply("warn_limit debe ser un número entero entre 1 y 20.")
          return
        }
        updateData.warnLimit = result.data
        break
      }
      case "mute_duration":
      case "muteduration": {
        const result = PolicySchema.shape.muteDuration.safeParse(parsedValue)
        if (!result.success) {
          await ctx.reply("mute_duration debe ser un número entero entre 1 y 43200 minutos.")
          return
        }
        updateData.muteDuration = result.data
        break
      }
      case "flood_limit":
      case "floodlimit": {
        const result = PolicySchema.shape.floodLimit.safeParse(parsedValue)
        if (!result.success) {
          await ctx.reply("flood_limit debe ser un número entero entre 1 y 50.")
          return
        }
        updateData.floodLimit = result.data
        break
      }
      case "flood_interval":
      case "floodinterval": {
        const result = PolicySchema.shape.floodInterval.safeParse(parsedValue)
        if (!result.success) {
          await ctx.reply("flood_interval debe ser un número entero entre 1000 y 60000 ms.")
          return
        }
        updateData.floodInterval = result.data
        break
      }
      case "auto_ban":
      case "autoban":
        updateData.autoBanOnWarn = parsedValue
        break
      case "vt_enabled":
      case "virustotal":
        updateData.vtEnabled = parsedValue
        break
      case "abuse_enabled":
      case "abuseipdb":
        updateData.abuseEnabled = parsedValue
        break
      default:
        await ctx.reply(`Clave no reconocida: ${key}`)
        return
    }

    await prisma.policy.update({
      where: { groupId: group.id },
      data: updateData,
    })

    await ctx.reply(`✅ Política actualizada: ${key} = ${parsedValue}`)
  })

  bot.command("integrations", async (ctx) => {
    const hasPermission = await hasModPermission(ctx)
    if (!hasPermission) {
      await ctx.reply("No tienes permisos para ejecutar este comando.")
      return
    }

    const integration = await prisma.integration.findFirst()

    if (!integration) {
      await ctx.reply("No hay integraciones configuradas.")
      return
    }

    const text = [
      "🔌 *Integraciones*",
      ``,
      `🔬 *VirusTotal*`,
      `Estado: ${integration.vtEnabled ? "✅" : "❌"}`,
      `API Key: ${integration.virustotalApiKey ? "Configurada ✅" : "No configurada ❌"}`,
      `Cuota: ${integration.vtQuotaUsed}/${integration.vtQuotaLimit}`,
      ``,
      `🛡️ *AbuseIPDB*`,
      `Estado: ${integration.abuseEnabled ? "✅" : "❌"}`,
      `API Key: ${integration.abuseipdbApiKey ? "Configurada ✅" : "No configurada ❌"}`,
      `Cuota: ${integration.abuseQuotaUsed}/${integration.abuseQuotaLimit}`,
    ].join("\n")

    await ctx.reply(text, { parse_mode: "Markdown" })
  })
}
