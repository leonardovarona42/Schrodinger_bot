import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface CardProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  action?: ReactNode
}

export function Card({ title, description, children, className, action }: CardProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 shadow-sm", className)}>
      {(title || description || action) && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            {title && <h3 className="font-semibold text-slate-900">{title}</h3>}
            {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: { value: number; positive: boolean }
  className?: string
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 shadow-sm p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trend.positive ? "text-green-600" : "text-red-600"}`}>
              {trend.positive ? "↑" : "↓"} {trend.value}% vs ayer
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  )
}

interface BadgeProps {
  children: ReactNode
  variant?: "default" | "success" | "warning" | "danger"
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
  }

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant])}>
      {children}
    </span>
  )
}
