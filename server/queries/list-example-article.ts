import { db } from "@/database";
import type { ArticleWithFeed } from "@/lib/types";
import { AddFeed } from "../mutations/add-feed";

const PREVIEW_RSS = "https://thisweekinreact.com/newsletter/rss.xml";

export async function ListExampleArticle(): Promise<ArticleWithFeed[]> {
	let feedRecord = await db.query.feed.findFirst({
		where: (feed, { eq }) => eq(feed.rssUrl, PREVIEW_RSS),
		with: {
			articles: {
				orderBy: (article, { desc }) => desc(article.publishedAt),
				limit: 10,
			},
		},
	});
	if (!feedRecord) {
		await AddFeed({
			url: PREVIEW_RSS,
		});
		feedRecord = await db.query.feed.findFirst({
			where: (feed, { eq }) => eq(feed.rssUrl, PREVIEW_RSS),
			with: {
				articles: {
					orderBy: (article, { desc }) => desc(article.publishedAt),
					limit: 10,
				},
			},
		});
	}

	if (!feedRecord || feedRecord.articles.length === 0) {
		return [];
	}

	return feedRecord.articles.map((article) => ({
		id: article.id,
		title: article.title || "",
		url: article.url || "",
		summary: "",
		publishedAt: article.publishedAt,
		feed: {
			id: feedRecord.id,
			title: feedRecord.title || "",
			url: feedRecord.url || "",
			rssUrl: feedRecord.rssUrl || "",
			description: feedRecord.description || "",
		},
	}));
}
