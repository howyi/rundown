import { ArticleList } from "@/components/shared/article-list";
import { Header } from "@/components/shared/header";
import { getUserId } from "@/lib/auth";
import { ListTimelineArticle } from "@/server/queries/list-timeline-article";

export default async function Home() {
	const userId = await getUserId();
	const articles = await ListTimelineArticle({ userId });

	return (
		<>
			<Header title="Timeline" />
			{/* <form action={ManualCrawlAction}>
				<Button type="submit">Crawl</Button>
			</form> */}
			<ArticleList articles={articles} />
		</>
	);
}
