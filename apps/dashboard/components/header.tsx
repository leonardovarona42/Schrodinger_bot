"use client"

import { signOut } from "next-auth/react"
import { User, LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

interface HeaderProps {
  user?: {
    name?: string | null
    email?: string | null
    role?: string
  }
}

export function Header({ user }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Panel de Control
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
          title={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
        >
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name || "Admin"}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role || "Administrator"}</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
          title="Cerrar Sesión"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Panel de Control
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900">{user?.name || "Admin"}</p>
            <p className="text-xs text-slate-500">{user?.role || "Administrator"}</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Cerrar Sesion"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
