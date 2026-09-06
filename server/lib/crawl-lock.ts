export interface CrawlLockClient {
	query(sql: string): Promise<{ rows: Array<{ acquired?: boolean }> }>;
	release(destroy?: boolean): void;
}

const ACQUIRE_CRAWL_LOCK_SQL =
	"SELECT pg_try_advisory_lock(1919250020, 1668440439) AS acquired";
const RELEASE_CRAWL_LOCK_SQL =
	"SELECT pg_advisory_unlock(1919250020, 1668440439)";

export async function runWithCrawlLock(
	client: CrawlLockClient,
	run: () => Promise<void>,
): Promise<boolean> {
	let acquired = false;
	let destroyConnection = false;
	let hasError = false;
	let caughtError: unknown;
	let ran = false;

	try {
		const result = await client.query(ACQUIRE_CRAWL_LOCK_SQL);
		acquired = result.rows[0]?.acquired === true;

		if (acquired) {
			await run();
			ran = true;
		}
	} catch (error) {
		hasError = true;
		caughtError = error;
	}

	if (acquired) {
		try {
			await client.query(RELEASE_CRAWL_LOCK_SQL);
		} catch (error) {
			destroyConnection = true;
			if (!hasError) {
				hasError = true;
				caughtError = error;
			}
		}
	}

	client.release(destroyConnection);

	if (hasError) {
		throw caughtError;
	}

	return ran;
}
