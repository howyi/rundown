import { ArticleList } from "@/components/shared/article-list";
import { getUserId } from "@/lib/auth";
import { ListTimelineArticle } from "@/server/queries/list-timeline-article";

export default async function Home() {
	const userId = await getUserId();
	const articles = await ListTimelineArticle({ userId });

	return <ArticleList articles={articles} />;
}
