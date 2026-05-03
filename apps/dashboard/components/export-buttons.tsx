"use client"

import { useState } from "react"
import { FileDown, FileSpreadsheet } from "lucide-react"
import { exportToCSV, exportToPDF } from "@/lib/export"

interface ExportButtonsProps {
  data: any[]
  filename: string
  headers?: string[]
}

export function ExportButtons({ data, filename, headers }: ExportButtonsProps) {
  const [exporting, setExporting] = useState(false)

  const handleExport = (format: "csv" | "pdf") => {
    if (exporting || data.length === 0) return
    setExporting(true)

    try {
      const exportHeaders = headers || (data[0] ? Object.keys(data[0]) : [])

      if (format === "csv") {
        exportToCSV(data, filename)
      } else {
        exportToPDF(filename, exportHeaders, data, filename)
      }
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setExporting(false)
    }
  }

  if (data.length === 0) return null

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport("csv")}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
      >
        <FileSpreadsheet className="w-4 h-4" />
        CSV
      </button>
      <button
        onClick={() => handleExport("pdf")}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
      >
        <FileDown className="w-4 h-4" />
        PDF
      </button>
    </div>
  )
}
