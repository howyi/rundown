import "@/envConfig";

import { getCrawlQueue } from "@/server/queues/crawl-queue";

async function registerJobs() {
	const timestamp = new Date().toISOString();

	const crawlQueue = getCrawlQueue();
	await crawlQueue.upsertJobScheduler(
		"crawl-job", // schedulerId
		{
			pattern: "*/15 * * * *",
		},
		{
			name: "crawl-job",
			data: {
				type: "crawl-task",
				trigger: "cron",
				timestamp,
				note: "RSS feed crawl every 15 minutes",
			},
			opts: {
				removeOnComplete: true,
			},
		},
	);

	console.log("crawl-job registered with pattern '*/15 * * * *'");

	await crawlQueue.close();
}

registerJobs().catch((err) => {
	console.error("Error registering jobs:", err);
});
