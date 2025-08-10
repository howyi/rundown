import { getUserId } from "@/lib/auth";
import { ListUserFeed } from "@/server/queries/list-user-feed";
import { SubscribeButton } from "../partials/subscribe-button";
import { FeedCard } from "./feed-card";

export async function FeedList() {
	const userId = await getUserId();

	const feeds = await ListUserFeed({ userId });

	if (feeds.length === 0) {
		return <div>No feeds available</div>;
	}

	return (
		<ul className="flex flex-col gap-2">
			{feeds.map((feed) => (
				<FeedCard key={feed.id} feed={feed}>
					<SubscribeButton feedId={feed.id} />
				</FeedCard>
			))}
		</ul>
	);
}
