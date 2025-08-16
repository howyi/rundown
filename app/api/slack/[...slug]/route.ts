import { eq } from "drizzle-orm";
import NextRouteHandlerReceiver from "@/app/api/slack/[...slug]/NextRouteHandlerReceiver";
import { db } from "@/database";
import { userSetting } from "@/database/schema/app";
import { GetSetting } from "@/server/queries/get-setting";

export const dynamic = "force-dynamic"; // defaults to force-static

const baseApiPath = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/slack`;
const oauthRedirectPath = "/oauth_redirect";
const installPath = "/install";
const eventPath = "/events";

const receiver = new NextRouteHandlerReceiver({
	// biome-ignore lint/style/noNonNullAssertion: required
	signingSecret: process.env.SLACK_SIGNING_SECRET!,
	clientId: process.env.SLACK_CLIENT_ID,
	clientSecret: process.env.SLACK_CLIENT_SECRET,
	installerOptions: {
		stateVerification: true,
		redirectUriPath: oauthRedirectPath,
		metadata: "true",
	},
	oauthRedirectPath,
	installPath,
	eventPath,
	scopes: ["incoming-webhook"],
	stateSecret: process.env.SLACK_STATE_SECRET,
	installationStore: {
		storeInstallation: async (installation) => {
			if (
				!installation.team ||
				!installation.team.id ||
				!installation.metadata
			) {
				throw new Error("Invalid installation data");
			}
			const userId = installation.metadata;

			await GetSetting(userId);

			await db
				.update(userSetting)
				.set({ notificationSlackInstallation: installation })
				.where(eq(userSetting.userId, userId));
		},
		fetchInstallation: async () => {
			throw new Error("fetchInstallation is not implemented");
		},
		deleteInstallation: async () => {
			throw new Error("deleteInstallation is not implemented");
		},
	},
	redirectUri: baseApiPath + oauthRedirectPath,
	loginRedirectUri: process.env.NEXT_PUBLIC_FRONTEND_URL,
});

const handler = await receiver.start();

export { handler as GET, handler as POST };
