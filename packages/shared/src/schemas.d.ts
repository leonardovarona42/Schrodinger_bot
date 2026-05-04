import { z } from "zod";
export declare const PolicySchema: z.ZodObject<{
    antiFlood: z.ZodDefault<z.ZodBoolean>;
    antiLink: z.ZodDefault<z.ZodBoolean>;
    antiForward: z.ZodDefault<z.ZodBoolean>;
    antiSpam: z.ZodDefault<z.ZodBoolean>;
    captchaOnJoin: z.ZodDefault<z.ZodBoolean>;
    warnLimit: z.ZodDefault<z.ZodNumber>;
    muteDuration: z.ZodDefault<z.ZodNumber>;
    floodLimit: z.ZodDefault<z.ZodNumber>;
    floodInterval: z.ZodDefault<z.ZodNumber>;
    autoBanOnWarn: z.ZodDefault<z.ZodBoolean>;
    spamSensitivity: z.ZodDefault<z.ZodEnum<["low", "medium", "high"]>>;
    groupRules: z.ZodOptional<z.ZodString>;
    vtEnabled: z.ZodDefault<z.ZodBoolean>;
    abuseEnabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    antiFlood: boolean;
    antiLink: boolean;
    antiForward: boolean;
    antiSpam: boolean;
    captchaOnJoin: boolean;
    warnLimit: number;
    muteDuration: number;
    floodLimit: number;
    floodInterval: number;
    autoBanOnWarn: boolean;
    spamSensitivity: "low" | "medium" | "high";
    vtEnabled: boolean;
    abuseEnabled: boolean;
    groupRules?: string | undefined;
}, {
    antiFlood?: boolean | undefined;
    antiLink?: boolean | undefined;
    antiForward?: boolean | undefined;
    antiSpam?: boolean | undefined;
    captchaOnJoin?: boolean | undefined;
    warnLimit?: number | undefined;
    muteDuration?: number | undefined;
    floodLimit?: number | undefined;
    floodInterval?: number | undefined;
    autoBanOnWarn?: boolean | undefined;
    spamSensitivity?: "low" | "medium" | "high" | undefined;
    groupRules?: string | undefined;
    vtEnabled?: boolean | undefined;
    abuseEnabled?: boolean | undefined;
}>;
export declare const UserSchema: z.ZodObject<{
    telegramId: z.ZodBigInt;
    username: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    role: z.ZodDefault<z.ZodEnum<["SUPER_ADMIN", "OWNER", "ADMIN", "MODERATOR", "VIEWER"]>>;
}, "strip", z.ZodTypeAny, {
    telegramId: bigint;
    role: "SUPER_ADMIN" | "OWNER" | "ADMIN" | "MODERATOR" | "VIEWER";
    username?: string | undefined;
    name?: string | undefined;
}, {
    telegramId: bigint;
    username?: string | undefined;
    name?: string | undefined;
    role?: "SUPER_ADMIN" | "OWNER" | "ADMIN" | "MODERATOR" | "VIEWER" | undefined;
}>;
export declare const GroupSettingsSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    rules: z.ZodOptional<z.ZodString>;
    welcomeMessage: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    rules?: string | undefined;
    welcomeMessage?: string | undefined;
}, {
    name?: string | undefined;
    rules?: string | undefined;
    welcomeMessage?: string | undefined;
}>;
export declare const IntegrationSchema: z.ZodObject<{
    virustotalApiKey: z.ZodOptional<z.ZodString>;
    abuseipdbApiKey: z.ZodOptional<z.ZodString>;
    vtEnabled: z.ZodDefault<z.ZodBoolean>;
    abuseEnabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    vtEnabled: boolean;
    abuseEnabled: boolean;
    virustotalApiKey?: string | undefined;
    abuseipdbApiKey?: string | undefined;
}, {
    vtEnabled?: boolean | undefined;
    abuseEnabled?: boolean | undefined;
    virustotalApiKey?: string | undefined;
    abuseipdbApiKey?: string | undefined;
}>;
export declare const ScanUrlSchema: z.ZodObject<{
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    url: string;
}, {
    url: string;
}>;
export declare const ScanIpSchema: z.ZodObject<{
    ip: z.ZodString;
}, "strip", z.ZodTypeAny, {
    ip: string;
}, {
    ip: string;
}>;
export type PolicyInput = z.infer<typeof PolicySchema>;
export type UserInput = z.infer<typeof UserSchema>;
export type GroupSettingsInput = z.infer<typeof GroupSettingsSchema>;
