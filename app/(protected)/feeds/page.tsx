import AddFeedForm from "@/components/partials/add-feed-form";
import { FeedList } from "@/components/shared/feed-list";
import { Header } from "@/components/shared/header";

export default async function Home() {
	return (
		<div>
			<Header title="Feed list" />
			<AddFeedForm />
			<FeedList />
		</div>
	);
}
