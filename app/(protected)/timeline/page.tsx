import { ArticleList } from "@/components/shared/article-list";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { getUserId } from "@/lib/auth";
import { ManualCrawlAction } from "@/server/controllers/actions";
import { ListTimelineArticle } from "@/server/queries/list-timeline-article";

export default async function Home() {
	const userId = await getUserId();
	const articles = await ListTimelineArticle({ userId });

	return (
		<>
			<Header title="Timeline" />
			<form action={ManualCrawlAction}>
				<Button type="submit">Crawl</Button>
			</form>
			<ArticleList articles={articles} />
		</>
	);
}
