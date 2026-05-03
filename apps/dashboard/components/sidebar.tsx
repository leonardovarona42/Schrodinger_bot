"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/groups", label: "Grupos", icon: Users },
  { href: "/dashboard/policies", label: "Politicas", icon: Shield },
  { href: "/dashboard/integrations", label: "Integraciones", icon: Plug },
  { href: "/dashboard/logs", label: "Logs", icon: ScrollText },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Configuracion", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Atom className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="font-bold text-lg">SchrodingerSec</h1>
            <p className="text-xs text-slate-400">Security Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500">v0.1.0</div>
      </div>
    </aside>
  )
}
