import { nanoid } from "nanoid";
import type { Item } from "rss-parser";
import type { article } from "@/database/schema/app";

export function ItemToArticle({
	articleId,
	feedId,
	item,
}: {
	articleId?: string;
	feedId: string;
	// biome-ignore lint/suspicious/noExplicitAny: Parser allows any type for item
	item: { [key: string]: any } & Item;
}): typeof article.$inferInsert {
	const publishedAt = item.pubDate
		? new Date(item.pubDate)
		: item["dc:date"]
			? new Date(item["dc:date"])
			: new Date();
	return {
		id: articleId || `a_${nanoid()}`,
		guid: item.guid || item.link || "",
		feedId: feedId,
		title: item.title || "",
		url: item.link || "",
		content:
			item["content:encoded"] || item.content || item.contentSnippet || "",
		publishedAt,
	};
}
