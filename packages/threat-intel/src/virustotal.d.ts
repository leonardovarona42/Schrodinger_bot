import { ScanResult } from "@schrodinger/shared";
export declare class VirusTotalService {
    private apiKey;
    private baseUrl;
    constructor();
    isEnabled(): Promise<boolean>;
    scanUrl(url: string): Promise<ScanResult | null>;
    private submitAndPollUrl;
    private parseUrlReport;
    private parseAnalysisResult;
    getQuotaInfo(): Promise<{
        apiCallsUsed: any;
        apiCallsLimit: any;
    } | null>;
}
