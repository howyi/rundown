import Link from "next/link";
import { getUserId } from "@/lib/auth";
import { ListUserFeed } from "@/server/queries/list-user-feed";

export async function FeedList() {
	const userId = await getUserId();

	const feeds = await ListUserFeed({ userId });

	if (feeds.length === 0) {
		return <div>No feeds available</div>;
	}

	return (
		<ul>
			{feeds.map((feed) => (
				<li key={feed.id} className="p-2 border-b truncate">
					<Link href={`/feeds/${feed.id}`}>{feed.title}</Link>
				</li>
			))}
		</ul>
	);
}
