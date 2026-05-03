import { getServerSession } from "next-auth"
import { authOptions } from "@schrodinger/auth"
import { redirect } from "next/navigation"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return children
}
