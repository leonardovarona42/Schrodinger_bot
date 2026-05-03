-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'OWNER', 'ADMIN', 'MODERATOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('WARN', 'MUTE', 'BAN', 'KICK', 'UNBAN', 'UNMUTE', 'DELETE_MESSAGE', 'BLACKLIST', 'WHITELIST', 'FLOOD_DETECTED', 'LINK_BLOCKED', 'IP_BLOCKED', 'SYSTEM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "telegramId" BIGINT NOT NULL,
    "username" TEXT,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'MODERATOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "telegramId" BIGINT NOT NULL,
    "name" TEXT,
    "members" INTEGER NOT NULL DEFAULT 0,
    "settingsJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warn" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "reason" TEXT,
    "createdById" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Warn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "antiFlood" BOOLEAN NOT NULL DEFAULT true,
    "antiLink" BOOLEAN NOT NULL DEFAULT true,
    "antiForward" BOOLEAN NOT NULL DEFAULT false,
    "antiSpam" BOOLEAN NOT NULL DEFAULT true,
    "captchaOnJoin" BOOLEAN NOT NULL DEFAULT false,
    "warnLimit" INTEGER NOT NULL DEFAULT 3,
    "muteDuration" INTEGER NOT NULL DEFAULT 15,
    "floodLimit" INTEGER NOT NULL DEFAULT 5,
    "floodInterval" INTEGER NOT NULL DEFAULT 3000,
    "autoBanOnWarn" BOOLEAN NOT NULL DEFAULT true,
    "spamSensitivity" TEXT NOT NULL DEFAULT 'medium',
    "groupRules" TEXT,
    "vtEnabled" BOOLEAN NOT NULL DEFAULT false,
    "abuseEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "virustotalApiKey" TEXT,
    "abuseipdbApiKey" TEXT,
    "vtEnabled" BOOLEAN NOT NULL DEFAULT false,
    "abuseEnabled" BOOLEAN NOT NULL DEFAULT false,
    "vtQuotaUsed" INTEGER NOT NULL DEFAULT 0,
    "abuseQuotaUsed" INTEGER NOT NULL DEFAULT 0,
    "vtQuotaLimit" INTEGER NOT NULL DEFAULT 500,
    "abuseQuotaLimit" INTEGER NOT NULL DEFAULT 1000,
    "lastVtQuery" TIMESTAMP(3),
    "lastAbuseQuery" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "actionType" "ActionType" NOT NULL,
    "actorId" TEXT,
    "targetId" TEXT,
    "details" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlacklistedUrl" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlacklistedUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhitelistedUrl" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhitelistedUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CacheEntry" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "expiresAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "CacheEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GroupToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GroupToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

-- CreateIndex
CREATE INDEX "User_telegramId_idx" ON "User"("telegramId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Group_telegramId_key" ON "Group"("telegramId");

-- CreateIndex
CREATE INDEX "Group_telegramId_idx" ON "Group"("telegramId");

-- CreateIndex
CREATE INDEX "Group_createdAt_idx" ON "Group"("createdAt");

-- CreateIndex
CREATE INDEX "Warn_userId_groupId_idx" ON "Warn"("userId", "groupId");

-- CreateIndex
CREATE INDEX "Warn_groupId_isActive_idx" ON "Warn"("groupId", "isActive");

-- CreateIndex
CREATE INDEX "Warn_createdById_idx" ON "Warn"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "Policy_groupId_key" ON "Policy"("groupId");

-- CreateIndex
CREATE INDEX "Log_groupId_createdAt_idx" ON "Log"("groupId", "createdAt");

-- CreateIndex
CREATE INDEX "Log_actionType_idx" ON "Log"("actionType");

-- CreateIndex
CREATE INDEX "Log_actorId_idx" ON "Log"("actorId");

-- CreateIndex
CREATE INDEX "Log_targetId_idx" ON "Log"("targetId");

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistedUrl_groupId_url_key" ON "BlacklistedUrl"("groupId", "url");

-- CreateIndex
CREATE UNIQUE INDEX "WhitelistedUrl_groupId_url_key" ON "WhitelistedUrl"("groupId", "url");

-- CreateIndex
CREATE UNIQUE INDEX "CacheEntry_key_key" ON "CacheEntry"("key");

-- CreateIndex
CREATE INDEX "CacheEntry_expiresAt_idx" ON "CacheEntry"("expiresAt");

-- CreateIndex
CREATE INDEX "_GroupToUser_B_index" ON "_GroupToUser"("B");

-- AddForeignKey
ALTER TABLE "Warn" ADD CONSTRAINT "Warn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warn" ADD CONSTRAINT "Warn_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warn" ADD CONSTRAINT "Warn_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlacklistedUrl" ADD CONSTRAINT "BlacklistedUrl_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhitelistedUrl" ADD CONSTRAINT "WhitelistedUrl_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToUser" ADD CONSTRAINT "_GroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupToUser" ADD CONSTRAINT "_GroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
