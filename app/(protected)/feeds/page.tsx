import AddFeedForm from "@/components/partials/add-feed-form";
import { FeedList } from "@/components/shared/feed-list";
import { Header } from "@/components/shared/header";
import { Separator } from "@/components/ui/separator";

export default async function Home() {
	return (
		<div>
			<Header title="Feed list" />
			<AddFeedForm />
			<Separator className="my-4" />
			<FeedList />
		</div>
	);
}
