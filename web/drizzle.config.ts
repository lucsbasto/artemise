import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Não gerencie os roles internos do Supabase (authenticated/anon/service_role).
  entities: {
    roles: {
      provider: "supabase",
    },
  },
});
