import { db } from "@/database";
import type { Feed } from "@/lib/types";

export async function ListUserFeed({
	userId,
}: {
	userId: string;
}): Promise<Feed[]> {
	const records = await db.query.userFeed.findMany({
		where: (userFeed, { eq }) => eq(userFeed.userId, userId),
		with: {
			feed: true,
		},
	});
	return records.map((record) => ({
		id: record.feedId,
		url: record.feed.url || "",
		rssUrl: record.feed.rssUrl || "",
		title: record.feed.title || "",
		description: record.feed.description || "",
	}));
}
