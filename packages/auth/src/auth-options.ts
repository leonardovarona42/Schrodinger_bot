import { NextAuthOptions, DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@schrodinger/database"
import { verifyMFAToken, getUserMFASecret, isMFAEnabled } from "./mfa-utils"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // Rate limiting check (max 5 attempts per 15 minutes per username)
        const rateLimitKey = `login_attempts:${credentials.username}`
        const rateLimitEntry = await prisma.cacheEntry.findUnique({ where: { key: rateLimitKey } })

        if (rateLimitEntry) {
          const data = rateLimitEntry.value as { attempts: number; firstAttempt: string }
          const firstAttempt = new Date(data.firstAttempt)
          const now = new Date()

          if (now.getTime() - firstAttempt.getTime() < 15 * 60 * 1000) {
            if (data.attempts >= 5) {
              throw new Error("Too many login attempts. Please try again in 15 minutes.")
            }
            await prisma.cacheEntry.update({
              where: { key: rateLimitKey },
              data: { value: { attempts: data.attempts + 1, firstAttempt: data.firstAttempt } },
            })
          } else {
            // Reset if window has passed
            await prisma.cacheEntry.update({
              where: { key: rateLimitKey },
              data: { value: { attempts: 1, firstAttempt: now.toISOString() }, expiresAt: new Date(now.getTime() + 15 * 60 * 1000) },
            })
          }
        } else {
          const now = new Date()
          await prisma.cacheEntry.create({
            data: {
              key: rateLimitKey,
              value: { attempts: 1, firstAttempt: now.toISOString() },
              expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
            },
          })
        }

        const validUser = process.env.ADMIN_USERNAME
        const validPassHash = process.env.ADMIN_PASSWORD_HASH

        if (!validUser || !validPassHash) {
          throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD_HASH must be configured")
        }

        if (credentials.username !== validUser) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password, validPassHash)
        if (!isValid) {
          return null
        }

        // Check if MFA is enabled for this user
        const mfaEnabled = await isMFAEnabled(credentials.username)

        if (mfaEnabled) {
          const mfaToken = credentials.mfaToken as string
          if (!mfaToken) {
            throw new Error("MFA_REQUIRED")
          }

          const mfaSecret = await getUserMFASecret(credentials.username)
          if (!mfaSecret || !verifyMFAToken(mfaToken, mfaSecret)) {
            throw new Error("Invalid MFA token")
          }
        }

        return {
          id: "1",
          name: validUser,
          role: "SUPER_ADMIN",
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "strict" as const,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
