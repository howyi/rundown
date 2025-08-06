import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/database";

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	plugins: [nextCookies()],
});
