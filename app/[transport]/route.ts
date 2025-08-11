// see: https://github.com/vercel/mcp-adapter

import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { eq } from "drizzle-orm";
import {
	createMcpHandler,
	experimental_withMcpAuth as withMcpAuth,
} from "mcp-handler";
import { z } from "zod";
import { db } from "@/database";
import { userSetting } from "@/database/schema/app";
import { ListTimelineArticle } from "@/server/queries/list-timeline-article";
import { ListUserFeed } from "@/server/queries/list-user-feed";

const res = <T>(data: T) => ({
	structuredContent: data,
	content: [{ type: "text" as const, text: JSON.stringify(data) }],
});

const handler = createMcpHandler((server) => {
	server.registerTool(
		"get-timeline",
		{
			title: "Get Timeline Articles",
			description: "get the latest articles from the user's timeline",
			annotations: {
				title: "Get Timeline Articles",
				readOnlyHint: true,
				openWorldHint: true,
			},
			inputSchema: {},
			outputSchema: {
				articles: z.array(
					z.object({
						title: z.string(),
						url: z.string().url().or(z.literal("")),
						summary: z.string(),
						publishedAt: z.string(),
						feedTitle: z.string(),
						feedUrl: z.string().url().or(z.literal("")),
					}),
				),
			},
		},
		async (_input, { authInfo }) => {
			const userId = (authInfo?.extra?.userId as string) ?? "";
			const articles = await ListTimelineArticle({
				userId,
				limit: 100,
			});
			return res({
				articles: articles.map((article) => ({
					title: article.title,
					url: article.url,
					summary: article.summary,
					publishedAt: article.publishedAt.toISOString(),
					feedTitle: article.feed.title,
					feedUrl: article.feed.url,
				})),
			});
		},
	);
	server.registerTool(
		"get-feed-list",
		{
			title: "Get Feed List",
			description: "get the list of feeds subscribed by the user",
			annotations: {
				title: "Get Feed List",
				readOnlyHint: true,
				openWorldHint: true,
			},
			inputSchema: {},
			outputSchema: {
				feeds: z.array(
					z.object({
						title: z.string(),
						url: z.string().url(),
						description: z.string(),
					}),
				),
			},
		},
		async (_input, { authInfo }) => {
			const userId = (authInfo?.extra?.userId as string) ?? "";
			const feeds = await ListUserFeed({
				userId,
			});
			return res({
				feeds: feeds.map((feed) => ({
					title: feed.title,
					url: feed.url,
					description: feed.description,
				})),
			});
		},
	);
});

// Wrap your handler with authorization
const verifyToken = async (
	_req: Request,
	bearerToken?: string,
): Promise<AuthInfo | undefined> => {
	if (!bearerToken) return undefined;

	const config = await db.query.userSetting.findFirst({
		where: eq(userSetting.mcpApiKey, bearerToken),
	});

	if (!config) return undefined;

	return {
		token: bearerToken,
		scopes: [], // Add relevant scopes
		clientId: config.userId, // Add user/client identifier
		extra: {
			// Optional extra information
			userId: config.userId,
		},
	};
};

// Make authorization required
const authHandler = withMcpAuth(handler, verifyToken, {
	required: true, // Make auth required for all requests
});

export { authHandler as GET, authHandler as POST };
