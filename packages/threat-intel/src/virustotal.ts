import { prisma } from "@schrodinger/database"
import { VirusTotalUrlReport, ScanResult, isSSRFProtected } from "@schrodinger/shared"
import { cache } from "./cache"

export class VirusTotalService {
  private apiKey: string
  private baseUrl = "https://www.virustotal.com/api/v3"

  constructor() {
    this.apiKey = process.env.VIRUSTOTAL_API_KEY || ""
  }

  async isEnabled(): Promise<boolean> {
    if (!this.apiKey) return false
    const config = await prisma.integration.findFirst()
    return config?.vtEnabled ?? false
  }

  async scanUrl(url: string): Promise<ScanResult | null> {
    if (!(await this.isEnabled())) return null

    if (!isSSRFProtected(url)) {
      return {
        isMalicious: false,
        score: 0,
        source: "virustotal",
        details: "URL not allowed: private or local address",
      }
    }

    // Check cache first
    const cacheKey = `vt:url:${url}`
    const cached = await cache.get(cacheKey)
    if (cached) {
      return cached as ScanResult
    }

    try {
      const encodedUrl = Buffer.from(url).toString("base64url")
      const reportUrl = `${this.baseUrl}/urls/${encodedUrl}`

      const response = await fetch(reportUrl, {
        headers: {
          "x-apikey": this.apiKey,
        },
      })

      if (response.status === 404) {
        const result = await this.submitAndPollUrl(url)
        if (result) {
          await cache.set(cacheKey, result, { ttlSeconds: 3600 })
        }
        return result
      }

      if (!response.ok) {
        console.error(`VirusTotal API error: ${response.status}`)
        return null
      }

      const data = await response.json()
      const result = this.parseUrlReport(data)
      await cache.set(cacheKey, result, { ttlSeconds: 3600 })
      return result
    } catch (error) {
      console.error("VirusTotal scan error:", error)
      return null
    }
  }

  private async submitAndPollUrl(url: string): Promise<ScanResult | null> {
    try {
      const form = new URLSearchParams({ url })
      const submitResponse = await fetch(`${this.baseUrl}/urls`, {
        method: "POST",
        headers: {
          "x-apikey": this.apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form.toString(),
      })

      if (!submitResponse.ok) {
        return null
      }

      const submitData = await submitResponse.json()
      const analysisId = submitData.data.id

      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 3000))

        const analysisResponse = await fetch(`${this.baseUrl}/analyses/${analysisId}`, {
          headers: { "x-apikey": this.apiKey },
        })

        if (!analysisResponse.ok) continue

        const analysisData = await analysisResponse.json()

        if (analysisData.data.attributes.status === "completed") {
          return this.parseAnalysisResult(analysisData)
        }
      }

      return null
    } catch (error) {
      console.error("VirusTotal submit error:", error)
      return null
    }
  }

  private parseUrlReport(data: any): ScanResult {
    const stats = data.data.attributes.last_analysis_stats || {}
    const malicious = stats.malicious || 0
    const suspicious = stats.suspicious || 0
    const harmless = stats.harmless || 0
    const undetected = stats.undetected || 0
    const total = malicious + suspicious + harmless + undetected

    return {
      isMalicious: malicious > 0 || suspicious > 2,
      score: total > 0 ? Math.round(((malicious + suspicious * 0.5) / total) * 100) : 0,
      source: "virustotal",
      details: `${malicious} malicious, ${suspicious} suspicious, ${harmless} harmless, ${undetected} undetected`,
      permalink: data.data.attributes.last_analysis_date
        ? `https://www.virustotal.com/gui/url/${data.data.id}`
        : undefined,
    }
  }

  private parseAnalysisResult(data: any): ScanResult {
    const stats = data.data.attributes.stats || {}
    const malicious = stats.malicious || 0
    const suspicious = stats.suspicious || 0
    const harmless = stats.harmless || 0
    const undetected = stats.undetected || 0
    const total = malicious + suspicious + harmless + undetected

    return {
      isMalicious: malicious > 0 || suspicious > 2,
      score: total > 0 ? Math.round(((malicious + suspicious * 0.5) / total) * 100) : 0,
      source: "virustotal",
      details: `${malicious} malicious, ${suspicious} suspicious, ${harmless} harmless, ${undetected} undetected`,
      permalink: `https://www.virustotal.com/gui/analysis/${data.data.id}`,
    }
  }

  async getQuotaInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/users/me`, {
        headers: { "x-apikey": this.apiKey },
      })

      if (!response.ok) return null

      const data = await response.json()
      return {
        apiCallsUsed: data.data.attributes.api_calls_used_today || 0,
        apiCallsLimit: data.data.attributes.api_quota_daily || 500,
      }
    } catch {
      return null
    }
  }
}
