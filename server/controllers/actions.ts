"use server";

import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/database";
import { userArticle, userFeed, userSetting } from "@/database/schema/app";
import { getUserId } from "@/lib/auth";
import type { FeedId } from "@/lib/types";
import { AddFeed } from "../mutations/add-feed";
import { Notification } from "../mutations/notification";
import { Summarize } from "../mutations/summarize";
import { GetSetting } from "../queries/get-setting";
import { ListTimelineArticle } from "../queries/list-timeline-article";

export type ActionState = {
	error?: string;
};
export async function AddFeedAction(
	// biome-ignore lint/suspicious/noExplicitAny: unused
	_prevState: any,
	formData: FormData,
): Promise<ActionState> {
	const schema = z.object({
		url: z.string().url(),
	});
	const result = schema.safeParse(Object.fromEntries(formData));
	if (!result.success) {
		return { error: "Invalid feed URL" };
	}
	const userId = await getUserId();
	await AddFeed({
		userId,
		url: result.data.url,
	});
	revalidatePath("/feeds");
	return {};
}

export async function DeleteFeed({ id }: { id: FeedId }): Promise<void> {
	const userId = await getUserId();
	console.log("DeleteFeed", userId, id);
}

export async function UnsubscribeAction(
	// biome-ignore lint/suspicious/noExplicitAny: unused
	_prevState: any,
	formData: FormData,
): Promise<ActionState> {
	const schema = z.object({
		feedId: z.string(),
	});
	const result = schema.safeParse(Object.fromEntries(formData));
	if (!result.success) {
		return { error: "Invalid feed ID" };
	}
	const userId = await getUserId();
	await db
		.delete(userFeed)
		.where(
			and(eq(userFeed.feedId, result.data.feedId), eq(userFeed.userId, userId)),
		);
	revalidatePath("/");
	return {};
}

export async function SaveSummarySettingAction(params: {
	language: string;
	length: string;
	customInstructions: string;
}): Promise<void> {
	const userId = await getUserId();
	await GetSetting(userId);
	await db
		.update(userSetting)
		.set({
			summaryLanguage: params.language,
			summaryLength: params.length,
			summaryInstructions: params.customInstructions,
		})
		.where(eq(userSetting.userId, userId));
}

export async function SummarizeAction(params: {
	articleId: string;
}): Promise<string> {
	const userId = await getUserId();
	const setting = await GetSetting(userId);
	const articleRecord = await db.query.article.findFirst({
		where: (article, { eq }) => eq(article.id, params.articleId),
	});
	if (!articleRecord) {
		throw new Error("Article not found");
	}
	return Summarize({
		userId,
		language: setting?.summaryLanguage,
		length: setting?.summaryLength,
		customInstructions: setting?.summaryInstructions,
		articleRecord,
	});
}

export async function RemoveSummaryAction(params: {
	articleId: string;
}): Promise<void> {
	const userId = await getUserId();
	await db
		.delete(userArticle)
		.where(
			and(
				eq(userArticle.userId, userId),
				eq(userArticle.articleId, params.articleId),
			),
		);
}

export async function PreviewSummarizeAction(params: {
	language: string;
	length: string;
	customInstructions: string;
	articleId: string;
}): Promise<string> {
	const userId = await getUserId();
	const articleRecord = await db.query.article.findFirst({
		where: (article, { eq }) => eq(article.id, params.articleId),
	});
	if (!articleRecord) {
		throw new Error("Article not found");
	}
	return Summarize({
		userId,
		language: params.language,
		length: params.length,
		customInstructions: params.customInstructions,
		articleRecord,
	});
}

// export async function ManualCrawlAction(): Promise<void> {
// 	await getCrawlQueue().add(
// 		"crawl",
// 		{},
// 		{
// 			removeOnComplete: true,
// 			removeOnFail: true,
// 		},
// 	);
// }

export async function AddDiscordWebhookAction(
	// biome-ignore lint/suspicious/noExplicitAny: unused
	_prevState: any,
	formData: FormData,
): Promise<ActionState> {
	// zodでバリデーション
	const schema = z.object({
		url: z
			.string()
			.url()
			.startsWith("https://discord.com/api/webhooks/")
			.or(z.literal("")),
	});
	const result = schema.safeParse(Object.fromEntries(formData));
	if (!result.success) {
		return { error: "Invalid Discord webhook URL" };
	}
	const userId = await getUserId();
	await db
		.update(userSetting)
		.set({
			notificationDiscordWebhookUrl: result.data.url,
		})
		.where(eq(userSetting.userId, userId));
	revalidatePath("/settings/notification");
	return {};
}

export async function TestNotificationAction(): Promise<ActionState> {
	const userId = await getUserId();
	const setting = await GetSetting(userId);
	const articles = await ListTimelineArticle({
		userId,
		limit: 1,
	});
	if (!articles.length || !articles[0]) {
		return { error: "No articles found for notification" };
	}
	const article = articles[0];
	let summary = article.summary;
	if (!summary) {
		const articleRecord = await db.query.article.findFirst({
			where: (article, { eq }) => eq(article.id, article.id),
		});
		if (!articleRecord) {
			return { error: "Article not found for summarization" };
		}
		summary = await Summarize({
			userId,
			language: setting?.summaryLanguage,
			length: setting?.summaryLength,
			customInstructions: setting?.summaryInstructions,
			articleRecord,
		});
	}
	await Notification({
		feedTitle: article.feed?.title || "",
		feedUrl: article.feed?.url || "",
		articleTitle: article.title,
		articleUrl: article.url,
		articleSummary: article.summary,
		setting,
	});
	return {};
}

export async function RegenerateApiKeyAction(): Promise<ActionState> {
	const userId = await getUserId();
	const newApiKey = `rd_${nanoid(32)}`;
	await db
		.update(userSetting)
		.set({
			mcpApiKey: newApiKey,
		})
		.where(eq(userSetting.userId, userId));
	revalidatePath("/settings/mcp");
	return {};
}

export async function RevokeApiKeyAction(): Promise<ActionState> {
	const userId = await getUserId();
	await db
		.update(userSetting)
		.set({
			mcpApiKey: "",
		})
		.where(eq(userSetting.userId, userId));
	revalidatePath("/settings/mcp");
	return {};
}
