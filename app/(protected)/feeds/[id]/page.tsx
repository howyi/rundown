import { Rss } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FeedFilterForm } from "@/components/partials/feed-filter-form";
import { SidebarOpenButton } from "@/components/partials/sidebar-fold-button";
import { ArticleList } from "@/components/shared/article-list";
import { FeedCard } from "@/components/shared/feed-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getUserId } from "@/lib/auth";
import { ListFeedArticle } from "@/server/queries/list-feed-article";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const feedId = await params.then((p) => p.id);
	const userId = await getUserId();
	const feed = await ListFeedArticle({ userId, feedId });
	return {
		title: `rundown | ${feed.title}`,
	};
}

export default async function Home({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const feedId = await params.then((p) => p.id);
	const userId = await getUserId();

	const feed = await ListFeedArticle({ userId, feedId });
	return (
		<>
			<SidebarOpenButton className="mb-2" />
			<FeedCard feed={feed}>
				<Button asChild variant={"secondary"}>
					<Link href={`/feeds`}>
						<Rss />
					</Link>
				</Button>
			</FeedCard>
			<FeedFilterForm
				feedId={feed.id}
				excludedTitleKeywords={feed.excludedTitleKeywords}
			/>
			<Separator className="my-4" />
			<ArticleList articles={feed.articles} />
		</>
	);
}
