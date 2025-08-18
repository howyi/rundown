import "@/envConfig";

import { crawlJobHandler } from "@/server/queues/crawl-queue";

crawlJobHandler({ data: { note: "" } }).catch((err) => {
	console.error("Error handling crawl job:", err);
});
