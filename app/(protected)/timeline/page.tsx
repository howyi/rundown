import { ArticleList } from "@/components/shared/article-list";
import { Button } from "@/components/ui/button";
import { getUserId } from "@/lib/auth";
import { ManualCrawlAction } from "@/server/controllers/actions";
import { ListTimelineArticle } from "@/server/queries/list-timeline-article";

export default async function Home() {
	const userId = await getUserId();
	const articles = await ListTimelineArticle({ userId });

	return (
		<>
			<form action={ManualCrawlAction}>
				<Button type="submit">Crawl</Button>
			</form>
			<ArticleList articles={articles} />
		</>
	);
}
