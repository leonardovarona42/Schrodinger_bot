import { NextAuthOptions, DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

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
