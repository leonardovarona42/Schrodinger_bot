"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Atom, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [mfaToken, setMfaToken] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showMFA, setShowMFA] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      username,
      password,
      mfaToken: showMFA ? mfaToken : undefined,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      if (result.error === "MFA_REQUIRED") {
        setShowMFA(true)
        setError("")
      } else if (result.error === "Invalid MFA token") {
        setError("Código MFA inválido")
      } else {
        setError("Usuario o contraseña incorrectos")
      }
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 mb-4">
            <Atom className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">SchrodingerSec</h1>
          <p className="text-slate-400 mt-2 text-sm">Platform Security Control Center</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!showMFA ? (
              <>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                    Usuario
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="admin"
                    autoComplete="username"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-sm text-slate-300">Autenticación de dos factores</p>
                  <p className="text-xs text-slate-400 mt-1">Ingresa el código de tu aplicación MFA</p>
                </div>
                <div>
                  <input
                    id="mfaToken"
                    type="text"
                    value={mfaToken}
                    onChange={(e) => setMfaToken(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-center text-lg tracking-widest"
                    placeholder="000000"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                  />
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25 hover:shadow-blue-500/25"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verificando...
                </span>
              ) : (
                showMFA ? "Verificar Código" : "Iniciar Sesión"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          &copy; 2026 SchrodingerSec Platform
        </p>
      </div>
    </div>
  )
}
