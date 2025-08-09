import { nanoid } from "nanoid";
import Parser from "rss-parser";
import { db } from "@/database";
import { article, feed, userFeed } from "@/database/schema/app";

const parser = new Parser();

export async function AddFeed({
	userId,
	url,
}: {
	userId: string;
	url: string;
}): Promise<void> {
	const existingFeedRecord = await db.query.feed.findFirst({
		where: (feed, { eq }) => eq(feed.rssUrl, url),
	});

	const parsed = await parser.parseURL(url);

	const feedId = existingFeedRecord?.id || `f_${nanoid()}`;
	const feedRecord: typeof feed.$inferInsert = {
		id: feedId,
		url: parsed.link || parsed.feedUrl || url,
		rssUrl: url,
		title: parsed.title || "",
		description: parsed.description || "",
	};
	const userFeedRecord: typeof userFeed.$inferInsert = {
		userId,
		feedId,
	};

	await db.insert(feed).values(feedRecord).onConflictDoUpdate({
		target: feed.rssUrl,
		set: feedRecord,
	});
	await db
		.insert(userFeed)
		.values(userFeedRecord)
		.onConflictDoUpdate({
			target: [userFeed.userId, userFeed.feedId],
			set: userFeedRecord,
		});

	if (parsed.items.length === 0) {
		return;
	}

	const articleGuids = parsed.items.map((item) => item.guid || item.link || "");
	const existingArticleRecords = await db.query.article.findMany({
		where: (article, { and, eq, inArray }) =>
			and(eq(article.feedId, feedId), inArray(article.guid, articleGuids)),
	});

	for (const item of parsed.items) {
		if (!item.link) {
			continue;
		}
		const existingArticleRecord = existingArticleRecords.find(
			(article) => article.guid === (item.guid || item.link),
		);
		const articleRecord: typeof article.$inferInsert = {
			id: existingArticleRecord?.id || `a_${nanoid()}`,
			guid: item.guid || item.link,
			feedId,
			title: item.title || "",
			url: item.link || "",
			content:
				item["content:encoded"] || item.content || item.contentSnippet || "",
			publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
		};
		// TODO fix N+1 issue
		await db
			.insert(article)
			.values(articleRecord)
			.onConflictDoUpdate({
				target: [article.id],
				set: articleRecord,
			});
	}
}
