import { sql } from "drizzle-orm";
import { db } from "@/database";
import type { FeedWithArticles } from "@/lib/types";
import { parseExcludedTitleKeywords } from "../lib/feed-filter";

export async function ListFeedArticle({
	userId,
	feedId,
}: {
	userId: string;
	feedId: string;
}): Promise<FeedWithArticles> {
	const subscription = await db.query.userFeed.findFirst({
		where: (userFeed, { and, eq }) =>
			and(eq(userFeed.userId, userId), eq(userFeed.feedId, feedId)),
	});
	if (!subscription) {
		throw new Error("Feed subscription not found");
	}
	const feedRecord = await db.query.feed.findFirst({
		where: (feed, { eq }) => eq(feed.id, feedId),
	});
	if (!feedRecord) {
		throw new Error("Feed not found");
	}
	const excludedTitleKeywords = parseExcludedTitleKeywords(
		subscription.excludedTitleKeywords,
	);
	const articleRecords = await db.query.article.findMany({
		where: (article, { and, eq }) =>
			and(
				eq(article.feedId, feedId),
				...excludedTitleKeywords.map(
					(keyword) => sql`strpos(lower(${article.title}), ${keyword}) = 0`,
				),
			),
		orderBy: (article, { desc }) => desc(article.publishedAt),
		with: {
			userArticles: {
				where: (userArticle, { eq }) => eq(userArticle.userId, userId),
			},
			feed: true,
		},
	});
	// TODO userId and article
	return {
		id: feedRecord.id,
		title: feedRecord.title || "",
		url: feedRecord.url || "",
		rssUrl: feedRecord.rssUrl || "",
		description: feedRecord.description || "",
		excludedTitleKeywords: subscription.excludedTitleKeywords,
		articles: articleRecords.map((article) => ({
			id: article.id,
			title: article.title || "",
			url: article.url || "",
			summary: article.userArticles[0]?.summary || "",
			publishedAt: article.publishedAt,
			feed: {
				id: article.feed.id,
				title: article.feed.title || "",
				url: article.feed.url || "",
				rssUrl: article.feed.rssUrl || "",
				description: article.feed.description || "",
				excludedTitleKeywords: subscription.excludedTitleKeywords,
			},
		})),
	};
}
