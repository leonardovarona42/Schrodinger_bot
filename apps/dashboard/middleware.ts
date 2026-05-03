import { withAuth } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

const ADMIN_ROLES = ["SUPER_ADMIN", "OWNER", "ADMIN"]

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    const path = req.nextUrl.pathname

    if (path.startsWith("/settings") && !ADMIN_ROLES.includes(token.role as string)) {
      return NextResponse.redirect(new URL("/", req.url))
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
