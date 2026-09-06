import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { type CrawlLockClient, runWithCrawlLock } from "./crawl-lock";

function createClient(acquired: boolean) {
	const queries: string[] = [];
	const releases: boolean[] = [];
	const client: CrawlLockClient = {
		async query(sql) {
			queries.push(sql);
			return { rows: [{ acquired }] };
		},
		release(destroy = false) {
			releases.push(destroy);
		},
	};

	return { client, queries, releases };
}

describe("crawl lock", () => {
	it("runs and releases the lock when it is acquired", async () => {
		const { client, queries, releases } = createClient(true);
		let runCount = 0;

		const ran = await runWithCrawlLock(client, async () => {
			runCount += 1;
		});

		assert.equal(ran, true);
		assert.equal(runCount, 1);
		assert.equal(queries.length, 2);
		assert.deepEqual(releases, [false]);
	});

	it("skips the crawl when another process holds the lock", async () => {
		const { client, queries, releases } = createClient(false);
		let runCount = 0;

		const ran = await runWithCrawlLock(client, async () => {
			runCount += 1;
		});

		assert.equal(ran, false);
		assert.equal(runCount, 0);
		assert.equal(queries.length, 1);
		assert.deepEqual(releases, [false]);
	});

	it("releases the lock when the crawl fails", async () => {
		const { client, queries, releases } = createClient(true);

		await assert.rejects(
			runWithCrawlLock(client, async () => {
				throw new Error("crawl failed");
			}),
			/crawl failed/,
		);

		assert.equal(queries.length, 2);
		assert.deepEqual(releases, [false]);
	});
});
