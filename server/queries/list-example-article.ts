import { db } from "@/database";
import type { ArticleWithFeed } from "@/lib/types";
import { AddFeed } from "../mutations/add-feed";

const PREVIEW_RSS = [
	"https://thisweekinreact.com/newsletter/rss.xml",
	"https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
	"https://www.reddit.com/r/nextjs.rss",
];

export async function ListExampleArticle(): Promise<ArticleWithFeed[]> {
	const respones: ArticleWithFeed[] = [];
	for (const rssUrl of PREVIEW_RSS) {
		let feedRecord = await db.query.feed.findFirst({
			where: (feed, { eq }) => eq(feed.rssUrl, rssUrl),
			with: {
				articles: {
					orderBy: (article, { desc }) => desc(article.publishedAt),
					limit: 2,
				},
			},
		});
		if (!feedRecord) {
			await AddFeed({
				url: rssUrl,
			});
			feedRecord = await db.query.feed.findFirst({
				where: (feed, { eq }) => eq(feed.rssUrl, rssUrl),
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

		respones.push(
			...feedRecord.articles.map((article) => ({
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
			})),
		);
	}
	return respones;
}
