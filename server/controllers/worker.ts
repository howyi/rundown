import "@/envConfig";

// 環境変数読み込み後に他のモジュールをインポート
import { Worker } from "bullmq";
import {
	getSampleQueue,
	RedisConnection,
	sampleJobHandler,
} from "@/server/queues/sample-queue";

const sampleWorker = new Worker(getSampleQueue().name, sampleJobHandler, {
	connection: RedisConnection,
	concurrency: 3,
});

// エラーハンドリング
sampleWorker.on("error", (error) => {
	console.error("❌ Sample Worker error:", error);
});

// 正常終了時の処理
process.on("SIGTERM", async () => {
	console.log("🛑 Worker shutting down...");
	await sampleWorker.close();
	process.exit(0);
});
