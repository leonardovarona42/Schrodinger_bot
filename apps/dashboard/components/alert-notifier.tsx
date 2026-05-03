"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "react-hot-toast" // You'll need to install react-hot-toast
import { AlertTriangle, Shield, Ban, Link2 } from "lucide-react"

interface AlertEvent {
  id: string
  actionType: string
  groupName?: string
  details?: string
  createdAt: string
}

export function AlertNotifier() {
  const eventSourceRef = useRef<EventSource | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const connect = () => {
      const eventSource = new EventSource("/api/alerts")

      eventSource.addEventListener("connected", (e) => {
        setIsConnected(true)
        console.log("Alerts stream connected")
      })

      eventSource.addEventListener("threat_alert", (e) => {
        try {
          const data = JSON.parse((e as MessageEvent).data) as AlertEvent
          showNotification(data)
        } catch (error) {
          console.error("Failed to parse alert:", error)
        }
      })

      eventSource.addEventListener("error", () => {
        setIsConnected(false)
        eventSource.close()
        // Retry after 5 seconds
        setTimeout(connect, 5000)
      })

      eventSourceRef.current = eventSource
    }

    connect()

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  const showNotification = (alert: AlertEvent) => {
    const icon = getAlertIcon(alert.actionType)
    const message = getAlertMessage(alert)

    toast.custom((t) => (
      <div className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-white shadow-lg rounded-lg border border-slate-200 p-4`}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">
              {alert.actionType.replace("_", " ")}
            </p>
            <p className="text-sm text-slate-600 mt-1">{message}</p>
            <p className="text-xs text-slate-400 mt-1">
              {alert.groupName} • {new Date(alert.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    ), { duration: 6000 })
  }

  const getAlertIcon = (actionType: string) => {
    if (actionType.includes("BAN") || actionType.includes("BLOCK")) {
      return <Ban className="w-5 h-5 text-red-600" />
    }
    if (actionType.includes("FLOOD") || actionType.includes("WARN")) {
      return <AlertTriangle className="w-5 h-5 text-amber-600" />
    }
    if (actionType.includes("LINK")) {
      return <Link2 className="w-5 h-5 text-blue-600" />
    }
    return <Shield className="w-5 h-5 text-slate-600" />
  }

  const getAlertMessage = (alert: AlertEvent) => {
    const details = alert.details || ""
    if (details.length > 100) {
      return details.substring(0, 100) + "..."
    }
    return details || `${alert.actionType} detected`
  }

  // This component doesn't render anything visible, just handles alerts
  return null
}
