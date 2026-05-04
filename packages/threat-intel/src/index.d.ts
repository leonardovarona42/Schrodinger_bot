import { VirusTotalService } from "./virustotal.js";
import { AbuseIPDBService } from "./abuseipdb.js";
export declare const threatIntel: {
    virustotal: VirusTotalService;
    abuseipdb: AbuseIPDBService;
};
export { VirusTotalService } from "./virustotal";
export { AbuseIPDBService } from "./abuseipdb";
export { cache, ThreatIntelCache } from "./cache";
