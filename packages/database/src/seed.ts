import { prisma } from "./index.js"

async function main() {
  console.log("Seeding database...")

  let integration = await prisma.integration.findFirst()

  if (!integration) {
    integration = await prisma.integration.create({
      data: {
        virustotalApiKey: null,
        abuseipdbApiKey: null,
        vtEnabled: false,
        abuseEnabled: false,
        vtQuotaUsed: 0,
        abuseQuotaUsed: 0,
        vtQuotaLimit: 500,
        abuseQuotaLimit: 1000,
      },
    })
    console.log("Created default integration settings")
  }

  console.log("Seed completed")
}

main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
