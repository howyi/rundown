import AddFeedForm from "@/components/partials/add-feed-form";
import { FeedList } from "@/components/shared/feed-list";

export default async function Home() {
	return (
		<div>
			<AddFeedForm />
			<FeedList />
		</div>
	);
}
