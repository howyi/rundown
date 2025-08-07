"use client";

import Link from "next/link";
import { useState } from "react";
import type { ArticleWithFeed } from "@/lib/types";
import {
	RemoveSummaryAction,
	SummarizeAction,
} from "@/server/controllers/actions";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { SummarizeButton } from "./summarize-button";

export function ArticleCard({ article }: { article: ArticleWithFeed }) {
	const [summarized, setSummarized] = useState(article.summary || "");

	const [summarizing, setSummarizing] = useState(false);
	const handleSummarize = async () => {
		setSummarizing(true);

		const summaryResponse = await SummarizeAction({
			articleId: article.id,
		});
		setSummarized(summaryResponse);
		setSummarizing(false);
	};

	const handleRemoveSummary = async () => {
		await RemoveSummaryAction({
			articleId: article.id,
		});
		setSummarized("");
	};
	return (
		<li className="p-2 flex flex-col gap-2 border-b">
			<div className="flex flex-row gap-2 text-xs">
				<div className="flex-1 italic">{article.feed.title}</div>
				<span className=" text-gray-500">
					{new Date(article.publishedAt).toLocaleDateString()}
				</span>
			</div>
			<Link
				target="_blank"
				href={article.url}
				className="font-bold hover:underline"
			>
				{article.title}
			</Link>
			<div className="relative text-sm mt-1 p-2 whitespace-pre-wrap border">
				{summarized ? (
					<>
						<p className="">{summarized}</p>
						<Button
							variant={"ghost"}
							onClick={handleRemoveSummary}
							size="sm"
							className="absolute bottom-1 right-1 text-muted-foreground text-xs h-4"
						>
							Remove Summary
						</Button>
					</>
				) : (
					<SummarizeButton
						summarizing={summarizing}
						onClick={handleSummarize}
					/>
				)}
				{summarizing && (
					<div className="space-y-2">
						<Skeleton className="h-4" />
						<Skeleton className="h-4 w-[50%]" />
						<Skeleton className="h-4 w-[70%]" />
						<Skeleton className="h-4 w-[40%]" />
					</div>
				)}
			</div>
		</li>
	);
}
