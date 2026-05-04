import { withAuth } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import { isAdmin, isModerator } from "./lib/rbac"

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    const path = req.nextUrl.pathname
    const userRole = token.role as string

    // Admin-only routes
    if (path.startsWith("/settings") && !isAdmin(userRole as any)) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    // Moderator-only routes
    if (
      (path.startsWith("/logs") || path.startsWith("/analytics")) &&
      !isModerator(userRole as any)
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    pages: {
      signIn: "/login",
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/groups", "/policies", "/integrations", "/logs", "/analytics", "/settings"],
}
