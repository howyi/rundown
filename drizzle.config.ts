import "@/envConfig";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./database/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: required
		url: process.env.POSTGRES_URL!,
	},
	verbose: true,
	strict: true,
});
