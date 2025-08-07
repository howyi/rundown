import { Queue } from "bullmq";

export const RedisConnection = {
	host: process.env.REDIS_HOST ?? "localhost",
	port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
	password: process.env.REDIS_PASSWORD || undefined,
	tls: process.env.REDIS_HOST?.includes("localhost") ? undefined : {},
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
	// ここにジョブの処理ロジックを追加
	// 例: データベースに保存、外部APIへのリクエストなど
}
