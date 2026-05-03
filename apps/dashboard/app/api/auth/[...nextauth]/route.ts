import NextAuth from "next-auth"
import { authOptions } from "@schrodinger/auth"

export const { handler: GET, handler: POST } = NextAuth(authOptions)
