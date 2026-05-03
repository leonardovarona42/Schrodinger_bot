import "./globals.css"
import { Toaster } from "react-hot-toast"
import { AlertNotifier } from "@/components/alert-notifier"
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <ThemeProvider>
          <AlertNotifier />
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
