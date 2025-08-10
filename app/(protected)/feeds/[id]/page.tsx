import type { Metadata } from "next";
import { ArticleList } from "@/components/shared/article-list";
import { Header } from "@/components/shared/header";
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
			<Header title={feed.title} />
			<ArticleList articles={feed.articles} />
		</>
	);
}
