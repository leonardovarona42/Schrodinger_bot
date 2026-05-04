interface CacheOptions {
    ttlSeconds?: number;
}
export declare class ThreatIntelCache {
    private defaultTTL;
    constructor(defaultTTLSeconds?: number);
    get(key: string): Promise<any | null>;
    set(key: string, value: any, options?: CacheOptions): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    cleanup(): Promise<void>;
}
export declare const cache: ThreatIntelCache;
export {};
