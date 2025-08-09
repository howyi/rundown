import { db } from "@/database";
import type { ArticleWithFeed } from "@/lib/types";

export async function ListTimelineArticle({
	userId,
}: {
	userId: string;
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
	const feedIds = feedRecords.map((record) => record.feedId);
	const articleRecords = await db.query.article.findMany({
		where: (article, { inArray }) => inArray(article.feedId, feedIds),
		orderBy: (article, { desc }) => desc(article.publishedAt),
		limit: 100,
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
			url: article.feed.rssUrl || "",
			description: article.feed.description || "",
		},
	}));
}
