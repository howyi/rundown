import "@/envConfig";

import { getCrawlQueue } from "@/server/queues/crawl-queue";

async function registerJobs() {
	const timestamp = new Date().toISOString();

	await getCrawlQueue().upsertJobScheduler(
		"crawl-job-every-15min", // schedulerId
		{
			pattern: "*/15 * * * *",
		},
		{
			name: "sample-job",
			data: {
				type: "sample-task",
				trigger: "cron",
				timestamp,
				note: "毎15分のクロール実行",
			},
			opts: {
				removeOnComplete: true,
			},
		},
	);

	console.log("crawl-job-every-15min registered with pattern '*/15 * * * *'");
}

registerJobs().catch((err) => {
	console.error("Error registering jobs:", err);
});
