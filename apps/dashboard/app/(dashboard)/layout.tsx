import { getServerSession } from "next-auth"
import { authOptions } from "@schrodinger/auth"
import { redirect } from "next/navigation"
import { SessionProvider } from "@/components/session-provider"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { AlertNotifier } from "@/components/alert-notifier"
import { Toaster } from "react-hot-toast"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header user={session.user} />
          <main className="flex-1 p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
      <AlertNotifier />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "text-sm",
          style: {
            background: "#fff",
            color: "#0f172a",
            border: "1px solid #e2e8f0",
          },
        }}
      />
    </SessionProvider>
  )
}
