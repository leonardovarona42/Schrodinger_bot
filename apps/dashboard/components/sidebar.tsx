"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  LayoutDashboard,
  Users,
  Shield,
  Plug,
  ScrollText,
  BarChart3,
  Settings,
  Atom,
} from "lucide-react"
import { isAdmin, isModerator } from "@/lib/rbac"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, minRole: "VIEWER" as const },
  { href: "/groups", label: "Grupos", icon: Users, minRole: "MODERATOR" as const },
  { href: "/policies", label: "Politicas", icon: Shield, minRole: "MODERATOR" as const },
  { href: "/integrations", label: "Integraciones", icon: Plug, minRole: "ADMIN" as const },
  { href: "/logs", label: "Logs", icon: ScrollText, minRole: "MODERATOR" as const },
  { href: "/analytics", label: "Analytics", icon: BarChart3, minRole: "MODERATOR" as const },
]

const adminNavItems = [
  { href: "/settings", label: "Configuracion", icon: Settings, minRole: "ADMIN" as const },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const userRole = session?.user?.role as string || "VIEWER"

  const canAccess = (minRole: string) => {
    if (minRole === "VIEWER") return true
    if (minRole === "MODERATOR") return isModerator(userRole as any)
    if (minRole === "ADMIN") return isAdmin(userRole as any)
    return false
  }

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen shrink-0">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center">
            <Atom className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="font-bold text-sm">SchrodingerSec</h1>
            <p className="text-xs text-slate-400">Security Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.filter(item => canAccess(item.minRole)).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          )
        })}

        {isAdmin(userRole as any) && (
          <div className="pt-4 border-t border-white/10 mt-4">
            {adminNavItems.filter(item => canAccess(item.minRole)).map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="px-3 py-2 rounded-lg bg-white/5">
          <p className="text-xs text-slate-400">Version</p>
          <p className="text-sm font-medium text-slate-300">v0.1.0</p>
        </div>
      </div>
    </aside>
  )
}
