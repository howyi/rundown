import type { ArticleWithFeed } from "@/lib/types";
import { ArticleCard } from "./article-card";

export async function ArticleList({
	articles,
}: {
	articles?: ArticleWithFeed[];
}) {
	if (!articles || articles.length === 0) {
		return <div>No articles available</div>;
	}

	return (
		<ul className="flex flex-col gap-4">
			{articles.map((article) => (
				<ArticleCard article={article} key={article.id} />
			))}
		</ul>
	);
}
