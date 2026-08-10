import { sql } from "drizzle-orm";
import { db } from "@/database";
import type { ArticleWithFeed } from "@/lib/types";
import { parseExcludedTitleKeywords } from "../lib/feed-filter";

export async function ListTimelineArticle({
	userId,
	limit = 100,
}: {
	userId: string;
	limit?: number;
}): Promise<ArticleWithFeed[]> {
	const feedRecords = await db.query.userFeed.findMany({
		where: (userFeed, { eq }) => eq(userFeed.userId, userId),
		with: {
			feed: true,
		},
	});
	if (!feedRecords) {
		return [];
	}
	if (feedRecords.length === 0) {
		return [];
	}
	const subscriptionsByFeedId = new Map(
		feedRecords.map((record) => [record.feedId, record]),
	);
	const articleRecords = await db.query.article.findMany({
		where: (article, { and, eq, or }) =>
			or(
				...feedRecords.map((record) =>
					and(
						eq(article.feedId, record.feedId),
						...parseExcludedTitleKeywords(record.excludedTitleKeywords).map(
							(keyword) => sql`strpos(lower(${article.title}), ${keyword}) = 0`,
						),
					),
				),
			),
		orderBy: (article, { desc }) => desc(article.publishedAt),
		limit,
		with: {
			userArticles: {
				where: (userArticle, { eq }) => eq(userArticle.userId, userId),
			},
			feed: true,
		},
	});
	return articleRecords.map((article) => ({
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
			excludedTitleKeywords:
				subscriptionsByFeedId.get(article.feed.id)?.excludedTitleKeywords ?? "",
		},
	}));
}
