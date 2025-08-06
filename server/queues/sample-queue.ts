import { Queue } from "bullmq";

export const RedisConnection = {
	host: process.env.REDIS_HOST ?? "localhost",
	port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
	password: process.env.REDIS_PASSWORD || undefined,
	tls: process.env.REDIS_HOST?.includes("localhost") ? {} : undefined,
};

// サンプルキュー
let sampleQueue: Queue;
export function getSampleQueue(): Queue {
	if (sampleQueue) {
		return sampleQueue;
	}

	sampleQueue = new Queue("sample", {
		connection: RedisConnection,
	});

	return sampleQueue;
}

type SampleQueueData = {
	note: string;
};

export async function sampleJobHandler(job: { data: SampleQueueData }) {
	const data = job.data;
	console.log(`Sample Job: ${data.note} | Job ID: ${data.note}`);
	// ここにジョブの処理ロジックを追加
	// 例: データベースに保存、外部APIへのリクエストなど
}
