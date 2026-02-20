import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: "../../apps/web/.env.local" })
config({ path: "../../.env" })

const databaseUrl = process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL or DATABASE_URL_DIRECT is required")
}

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
})
