import { authenticator } from "otplib"
import * as qrcode from "qrcode"
import { prisma } from "@schrodinger/database"

export interface MFASetupResult {
  secret: string
  qrCodeUrl: string
  otpAuthUrl: string
}

export async function generateMFASecret(userName: string): Promise<MFASetupResult> {
  const secret = authenticator.generateSecret()

  const otpAuthUrl = authenticator.keyuri(userName, "SchrodingerSec", secret)

  const qrCodeUrl = await qrcode.toDataURL(otpAuthUrl)

  return { secret, qrCodeUrl, otpAuthUrl }
}

export function verifyMFAToken(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret })
  } catch {
    return false
  }
}

export async function getUserMFASecret(userName: string): Promise<string | null> {
  const entry = await prisma.cacheEntry.findUnique({
    where: { key: `mfa_secret:${userName}` },
  })
  return entry?.value as string | null
}

export async function setUserMFASecret(userName: string, secret: string): Promise<void> {
  await prisma.cacheEntry.upsert({
    where: { key: `mfa_secret:${userName}` },
    update: { value: secret },
    create: {
      key: `mfa_secret:${userName}`,
      value: secret,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    },
  })
}

export async function enableMFAForUser(userName: string): Promise<void> {
  await prisma.cacheEntry.upsert({
    where: { key: `mfa_enabled:${userName}` },
    update: { value: { enabled: true } },
    create: {
      key: `mfa_enabled:${userName}`,
      value: { enabled: true },
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  })
}

export async function isMFAEnabled(userName: string): Promise<boolean> {
  const entry = await prisma.cacheEntry.findUnique({
    where: { key: `mfa_enabled:${userName}` },
  })
  return entry?.value?.enabled === true
}
