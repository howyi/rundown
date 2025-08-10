import { type ConnectionOptions, Queue } from "bullmq";
import Parser from "rss-parser";
import { db } from "@/database";
import { article, type feed, type userFeed } from "@/database/schema/app";
import { ItemToArticle } from "../lib/item-to-article";
import { Notification } from "../mutations/notification";
import { Summarize } from "../mutations/summarize";

export const RedisConnection: ConnectionOptions = {
	family: process.env.REDIS_HOST?.includes("localhost") ? undefined : 0,
	host: process.env.REDIS_HOST ?? "localhost",
	port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
	password: process.env.REDIS_PASSWORD || undefined,
};

// クロールキュー
let crawlQueue: Queue;
export function getCrawlQueue(): Queue {
	if (crawlQueue) {
		return crawlQueue;
	}

	crawlQueue = new Queue("crawl", {
		connection: RedisConnection,
	});

	return crawlQueue;
}

type CrawlQueueData = {
	note: string;
};

export async function crawlJobHandler(job: { data: CrawlQueueData }) {
	const data = job.data;
	console.log(`Crawl Job: ${data.note} | Job ID: ${data.note}`);

	const userFeedRecords = await db.query.userFeed.findMany();

	// array unique
	const feedIds = Array.from(
		new Set(userFeedRecords.map((record) => record.feedId)),
	);
	const feedRecords = await db.query.feed.findMany({
		where: (feed, { inArray }) => inArray(feed.id, feedIds),
	});

	for (const feedRecord of feedRecords) {
		await crawlArticle({
			feedRecord,
			userFeedRecords: userFeedRecords.filter(
				(record) => record.feedId === feedRecord.id,
			),
		});
	}
}

const parser = new Parser();

async function crawlArticle({
	feedRecord,
	userFeedRecords,
}: {
	feedRecord: typeof feed.$inferSelect;
	userFeedRecords: (typeof userFeed.$inferSelect)[];
}): Promise<void> {
	console.log(`Crawling feed: ${feedRecord.title} (${feedRecord.rssUrl})`);

	const parsed = await parser.parseURL(feedRecord.rssUrl);

	const articleGuids = parsed.items
		.map((item) => item.guid || item.link || "")
		.filter((guid) => guid !== "");

	const existingArticleRecords = await db.query.article.findMany({
		where: (article, { and, eq, inArray }) =>
			and(
				eq(article.feedId, feedRecord.id),
				inArray(article.guid, articleGuids),
			),
	});

	for (const item of parsed.items) {
		const articleGuid = item.guid || item.link;
		if (existingArticleRecords.find((record) => record.guid === articleGuid)) {
			continue;
		}
		console.log(`Processing new article: ${item.title} (${articleGuid})`);
		const articleRecord = ItemToArticle({
			feedId: feedRecord.id,
			item,
		});
		await db.insert(article).values(articleRecord);

		for (const userFeedRecord of userFeedRecords) {
			const setting = await db.query.userSetting.findFirst({
				where: (setting, { eq }) => eq(setting.userId, userFeedRecord.userId),
			});
			console.log(`Found user setting for user ${userFeedRecord.userId}`);
			const summary = await Summarize({
				userId: userFeedRecord.userId,
				language: setting?.summaryLanguage,
				length: setting?.summaryLength,
				customInstructions: setting?.summaryInstructions,
				articleRecord,
			});
			console.log(
				`Summarized article: ${item.title} (${userFeedRecord.userId}) ${articleGuid}`,
			);

			await Notification({
				feedTitle: feedRecord.title,
				feedUrl: feedRecord.url || undefined,
				articleTitle: articleRecord.title,
				articleUrl: articleRecord.url,
				articleSummary: summary,
				discordWebhookUrl: setting?.notificationDiscordWebhookUrl,
			});

			console.log(
				`Notified user ${userFeedRecord.userId} about new article: ${item.title}`,
			);
		}
	}
}
