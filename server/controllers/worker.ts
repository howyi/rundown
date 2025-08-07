import "@/envConfig";

// 環境変数読み込み後に他のモジュールをインポート
import { Worker } from "bullmq";
import {
	crawlJobHandler,
	getCrawlQueue,
	RedisConnection,
} from "@/server/queues/crawl-queue";

const crawlWorker = new Worker(getCrawlQueue().name, crawlJobHandler, {
	connection: RedisConnection,
	concurrency: 3,
});

// エラーハンドリング
crawlWorker.on("error", (error) => {
	console.error("❌ Crawl Worker error:", error);
});

// 正常終了時の処理
process.on("SIGTERM", async () => {
	console.log("🛑 Worker shutting down...");
	await crawlWorker.close();
	process.exit(0);
});
