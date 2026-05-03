import jsPDF from "jspdf"
import "jspdf-autotable"

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Escape quotes and wrap in quotes if contains comma
          if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(","),
    ),
  ]

  const csvContent = csvRows.join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  downloadBlob(blob, `${filename}.csv`)
}

export function exportToPDF(
  title: string,
  headers: string[],
  data: any[],
  filename: string,
) {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(16)
  doc.text(title, 14, 22)

  // Add date
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30)

  // Add table
  ;(doc as any).autoTable({
    head: [headers],
    body: data.map((row) => headers.map((h) => row[h] ?? "")),
    startY: 40,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246] }, // Blue-500
  })

  doc.save(`${filename}.pdf`)
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
