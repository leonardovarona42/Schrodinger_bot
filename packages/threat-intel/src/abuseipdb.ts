import { prisma } from "@schrodinger/database"
import { ScanResult } from "@schrodinger/shared"

export class AbuseIPDBService {
  private apiKey: string
  private baseUrl = "https://api.abuseipdb.com/api/v2"

  constructor() {
    this.apiKey = process.env.ABUSEIPDB_API_KEY || ""
  }

  async isEnabled(): Promise<boolean> {
    if (!this.apiKey) return false
    const config = await prisma.integration.findFirst()
    return config?.abuseEnabled ?? false
  }

  async checkIp(ip: string): Promise<ScanResult | null> {
    if (!(await this.isEnabled())) return null

    if (!this.isValidIp(ip)) {
      return {
        isMalicious: false,
        score: 0,
        source: "abuseipdb",
        details: "Invalid IP address format",
      }
    }

    try {
      const params = new URLSearchParams({
        ipAddress: ip,
        maxAgeInDays: "90",
        verbose: "",
      })

      const response = await fetch(`${this.baseUrl}/check?${params.toString()}`, {
        headers: {
          Key: this.apiKey,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 429) {
          console.error("AbuseIPDB rate limit exceeded")
        }
        return null
      }

      const data = await response.json()
      return this.parseReport(data)
    } catch (error) {
      console.error("AbuseIPDB check error:", error)
      return null
    }
  }

  private isValidIp(ip: string): boolean {
    const parts = ip.split(".")
    if (parts.length !== 4) return false
    return parts.every((part) => {
      const num = parseInt(part, 10)
      return !isNaN(num) && num >= 0 && num <= 255 && String(num) === part
    })
  }

  private parseReport(data: any): ScanResult {
    const ip = data.data
    const score = ip.abuseConfidenceScore || 0
    const isMalicious = score >= 50

    let severity = "low"
    if (score >= 75) severity = "critical"
    else if (score >= 50) severity = "high"
    else if (score >= 25) severity = "medium"

    const details = [
      `Confidence: ${score}%`,
      `Country: ${ip.countryCode || "N/A"}`,
      `Usage: ${ip.usageType || "N/A"}`,
      `Reports: ${ip.totalReports || 0}`,
      `Severity: ${severity}`,
    ].join(" | ")

    return {
      isMalicious,
      score,
      source: "abuseipdb",
      details,
      permalink: `https://www.abuseipdb.com/check/${ip.ipAddress}`,
    }
  }

  async getQuotaInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/reports`, {
        headers: {
          Key: this.apiKey,
          Accept: "application/json",
        },
      })

      if (response.headers.has("X-RateLimit-Remaining")) {
        return {
          remaining: parseInt(response.headers.get("X-RateLimit-Remaining") || "0", 10),
          limit: parseInt(response.headers.get("X-RateLimit-Max-Requests") || "1000", 10),
        }
      }

      return { remaining: 1000, limit: 1000 }
    } catch {
      return null
    }
  }
}
