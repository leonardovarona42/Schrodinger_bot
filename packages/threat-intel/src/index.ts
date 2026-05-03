import { VirusTotalService } from "./virustotal.js"
import { AbuseIPDBService } from "./abuseipdb.js"

export const threatIntel = {
  virustotal: new VirusTotalService(),
  abuseipdb: new AbuseIPDBService(),
}

export { VirusTotalService } from "./virustotal.js"
export { AbuseIPDBService } from "./abuseipdb.js"
