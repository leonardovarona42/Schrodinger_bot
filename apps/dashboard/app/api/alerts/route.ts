import { getServerSession } from "next-auth/next"
import { authOptions } from "@schrodinger/auth"
import { prisma } from "@schrodinger/database"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const lastEventId = searchParams.get("lastEventId")

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection confirmation
      controller.enqueue(`event: connected\ndata: ${JSON.stringify({ message: "Connected to alerts stream" })}\n\n`)

      // Check for new logs since lastEventId
      const query: any = {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { group: true },
      }

      if (lastEventId) {
        query.where = {
          id: { gt: lastEventId },
        }
      }

      const newLogs = await prisma.log.findMany(query)

      for (const log of newLogs.reverse()) {
        const data = JSON.stringify({
          id: log.id,
          actionType: log.actionType,
          groupName: (log as any).group?.name ?? "Unknown",
          details: log.details,
          createdAt: log.createdAt,
        })

        controller.enqueue(`event: threat_alert\ndata: ${data}\n\n`)
      }

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(`: heartbeat\n\n`)
        } catch {
          clearInterval(heartbeat)
        }
      }, 30000)

      // Cleanup on close
      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
