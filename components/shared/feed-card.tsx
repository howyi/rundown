import Link from "next/link";
import type { PropsWithChildren } from "react";
import type { Feed } from "@/lib/types";

export async function FeedCard({
	feed,
	children,
}: { feed: Feed } & PropsWithChildren) {
	return (
		<li
			key={feed.id}
			className="p-4 border-gray-600 bg-foreground/70 text-background border-2 border-l-8 grid grid-cols-[1fr_0fr] grid-rows-2 gap-1"
		>
			<Link className="font-bold" href={`/feeds/${feed.id}`}>
				{feed.title}
			</Link>
			<div className="row-span-4 my-auto">{children}</div>
			<p className="text-muted">{feed.description}</p>
			<p className="text-muted text-xs">
				URL:
				<a target="_blank" className="hover:underline" href={feed.url}>
					{feed.url}
				</a>
			</p>
			<p className="text-muted text-xs">
				RSS URL:{" "}
				<a target="_blank" className="hover:underline" href={feed.rssUrl}>
					{feed.rssUrl}
				</a>
			</p>
		</li>
	);
}
