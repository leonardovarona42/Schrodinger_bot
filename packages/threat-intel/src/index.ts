import { VirusTotalService } from "./virustotal.js"
import { AbuseIPDBService } from "./abuseipdb.js"
import { cache, ThreatIntelCache } from "./cache"

export const threatIntel = {
  virustotal: new VirusTotalService(),
  abuseipdb: new AbuseIPDBService(),
}

export { VirusTotalService } from "./virustotal"
export { AbuseIPDBService } from "./abuseipdb"
export { cache, ThreatIntelCache } from "./cache"
