import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const dbUrl = new URL(process.env.DATABASE_URL!);

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: dbUrl.hostname,
    port: Number(dbUrl.port) || 4000,
    user: decodeURIComponent(dbUrl.username),
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.replace(/^\//, "") || "test",
    ssl: {
      rejectUnauthorized: true,
    },
  },
});
