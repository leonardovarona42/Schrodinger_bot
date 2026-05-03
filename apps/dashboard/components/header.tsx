"use client"

import { signOut } from "next-auth/react"
import { User, LogOut } from "lucide-react"

interface HeaderProps {
  user?: {
    name?: string | null
    email?: string | null
    role?: string
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
