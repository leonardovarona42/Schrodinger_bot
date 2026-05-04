export declare const BOT_NAME = "Schr\\u00f6dingerSec Bot";
export declare const COMMAND_PREFIX = "/";
export declare const DEFAULT_WARN_LIMIT = 3;
export declare const DEFAULT_MUTE_MINUTES = 15;
export declare const DEFAULT_FLOOD_LIMIT = 5;
export declare const DEFAULT_FLOOD_INTERVAL = 3000;
export declare const CACHE_TTL: {
    VIRUSTOTAL_URL: number;
    ABUSEIPDB_IP: number;
    GROUP_SETTINGS: number;
    USER_SETTINGS: number;
};
export declare const MESSAGES: {
    WELCOME: string;
    HELP: string;
    NOT_ADMIN: string;
    USER_NOT_FOUND: string;
    WARN_ADDED: (reason: string) => string;
    USER_MUTED: (duration: string) => string;
    USER_BANNED: string;
    USER_KICKED: string;
    USER_UNBANNED: string;
    USER_UNMUTED: string;
};
