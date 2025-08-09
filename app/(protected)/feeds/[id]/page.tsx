import type { Metadata } from "next";
import { ArticleList } from "@/components/shared/article-list";
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
			<h2 className="text-2xl font-bold mb-4 truncate">{feed.title}</h2>
			<ArticleList articles={feed.articles} />
		</>
	);
}
