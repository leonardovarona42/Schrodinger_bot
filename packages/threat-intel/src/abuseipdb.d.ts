import { ScanResult } from "@schrodinger/shared";
export declare class AbuseIPDBService {
    private apiKey;
    private baseUrl;
    constructor();
    isEnabled(): Promise<boolean>;
    checkIp(ip: string): Promise<ScanResult | null>;
    private isValidIp;
    private parseReport;
    getQuotaInfo(): Promise<{
        remaining: number;
        limit: number;
    } | null>;
}
