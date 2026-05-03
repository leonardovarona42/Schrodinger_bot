import { threatIntel } from "@schrodinger/threat-intel"
import { extractUrls, extractIPs } from "@schrodinger/shared"
import { prisma } from "@schrodinger/database"
import { createLog } from "./logger.js"

export interface ScanMessageResult {
  urls: Array<{ url: string; isMalicious: boolean; score: number; source: string }>
  ips: Array<{ ip: string; isMalicious: boolean; score: number; source: string }>
}

export async function scanMessage(text: string, groupId: string, policy: { vtEnabled: boolean; abuseEnabled: boolean }): Promise<ScanMessageResult> {
  const result: ScanMessageResult = { urls: [], ips: [] }

  if (!text) return result

  const urls = extractUrls(text)
  const ips = extractIPs(text)

  for (const url of urls) {
    const isWhitelisted = await isUrlWhitelisted(groupId, url)
    if (isWhitelisted) continue

    const isBlacklisted = await isUrlBlacklisted(groupId, url)
    if (isBlacklisted) {
      result.urls.push({ url, isMalicious: true, score: 100, source: "blacklist" })
      await createLog({
        groupId,
        actionType: "LINK_BLOCKED",
        details: `Blacklisted URL: ${url}`,
      })
      continue
    }

    if (policy.vtEnabled) {
      const vtResult = await threatIntel.virustotal.scanUrl(url)
      if (vtResult) {
        result.urls.push({
          url,
          isMalicious: vtResult.isMalicious,
          score: vtResult.score,
          source: "virustotal",
        })

        if (vtResult.isMalicious) {
          await createLog({
            groupId,
            actionType: "LINK_BLOCKED",
            details: `Malicious URL: ${url} (score: ${vtResult.score}%)`,
          })
        }
      }
    }
  }

  for (const ip of ips) {
    if (policy.abuseEnabled) {
      const abuseResult = await threatIntel.abuseipdb.checkIp(ip)
      if (abuseResult) {
        result.ips.push({
          ip,
          isMalicious: abuseResult.isMalicious,
          score: abuseResult.score,
          source: "abuseipdb",
        })

        if (abuseResult.isMalicious) {
          await createLog({
            groupId,
            actionType: "IP_BLOCKED",
            details: `Malicious IP: ${ip} (score: ${abuseResult.score}%)`,
          })
        }
      }
    }
  }

  return result
}

async function isUrlWhitelisted(groupId: string, url: string): Promise<boolean> {
  const normalized = url.toLowerCase().split("/")[2] || url.toLowerCase()
  const whitelisted = await prisma.whitelistedUrl.findMany({ where: { groupId } })
  return whitelisted.some(
    (wu) => wu.url.toLowerCase().includes(normalized) || normalized.includes(wu.url.toLowerCase())
  )
}

async function isUrlBlacklisted(groupId: string, url: string): Promise<boolean> {
  const normalized = url.toLowerCase().split("/")[2] || url.toLowerCase()
  const blacklisted = await prisma.blacklistedUrl.findMany({ where: { groupId } })
  return blacklisted.some(
    (bu) => bu.url.toLowerCase().includes(normalized) || normalized.includes(bu.url.toLowerCase())
  )
}

export async function getThreatSummary(groupId: string) {
  const totalLogs = await prisma.log.count({ where: { groupId } })
  const blockedLinks = await prisma.log.count({ where: { groupId, actionType: "LINK_BLOCKED" } })
  const blockedIPs = await prisma.log.count({ where: { groupId, actionType: "IP_BLOCKED" } })
  const floodEvents = await prisma.log.count({ where: { groupId, actionType: "FLOOD_DETECTED" } })
  const activeWarns = await prisma.warn.count({ where: { groupId, isActive: true } })

  return {
    totalLogs,
    blockedLinks,
    blockedIPs,
    floodEvents,
    activeWarns,
  }
}
