import type { Item } from "rss-parser";

export function parseExcludedTitleKeywords(value: string): string[] {
	return value
		.split(/[\n,]/)
		.map((keyword) => keyword.trim().toLowerCase())
		.filter((keyword) => keyword.length > 0);
}

export function isItemExcludedByTitle(
	item: Pick<Item, "title">,
	excludedTitleKeywords: string,
): boolean {
	const title = (item.title ?? "").toLowerCase();
	return parseExcludedTitleKeywords(excludedTitleKeywords).some((keyword) =>
		title.includes(keyword),
	);
}
