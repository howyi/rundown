import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { organization } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/database";
import { userArticle, userFeed, userSetting } from "@/database/schema/app";
import { publicInvitation } from "@/database/schema/auth";

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	plugins: [
		nextCookies(),
		organization({
			organizationDeletion: {
				disabled: false, //to disable it altogether
				beforeDelete: async (data) => {
					// a callback to run before deleting org
					await db
						.delete(userFeed)
						.where(eq(userFeed.userId, `o_${data.organization.id}`));
					await db
						.delete(userSetting)
						.where(eq(userSetting.userId, `o_${data.organization.id}`));
					await db
						.delete(userArticle)
						.where(eq(userArticle.userId, `o_${data.organization.id}`));
					await db
						.delete(publicInvitation)
						.where(eq(publicInvitation.organizationId, data.organization.id));
				},
				afterDelete: async () => {
					// a callback to run after deleting org
				},
			},
		}),
	],
});

export async function getUserId() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session || !session.user.id) {
		throw new Error("User not authenticated");
	}
	if (session.session.activeOrganizationId) {
		return `o_${session.session.activeOrganizationId}`;
	}
	return session.user.id;
}
