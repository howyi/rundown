import "@/envConfig";

import { getSampleQueue } from "@/server/queues/sample-queue";

async function registerJobs() {
	// 現時点の timestamp を埋め込んで固定データとして登録
	const timestamp = new Date().toISOString();

	// 新しいスケジューラを登録（重複があれば上書き）
	await getSampleQueue().upsertJobScheduler(
		"sample-job-every-5min", // schedulerId
		{
			pattern: "*/5 * * * *", // cronパターン
			tz: "Asia/Tokyo", // タイムゾーン
		},
		{
			name: "sample-job",
			data: {
				type: "sample-task",
				trigger: "cron",
				timestamp,
				note: "毎5分のテスト実行",
			},
			opts: {
				removeOnComplete: true,
			},
		},
	);

	console.log("定期ジョブを登録");
}

registerJobs().catch((err) => {
	console.error("ジョブ登録中にエラー:", err);
});
