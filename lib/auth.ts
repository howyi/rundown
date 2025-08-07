import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
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

export async function getUserId() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session || !session.user.id) {
		throw new Error("User not authenticated");
	}
	return session.user.id;
}
