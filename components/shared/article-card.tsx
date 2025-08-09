"use client";

import Link from "next/link";
import { useState } from "react";
import type { ArticleWithFeed } from "@/lib/types";
import {
	RemoveSummaryAction,
	SummarizeAction,
} from "@/server/controllers/actions";
import { Button } from "../ui/button";
import { SummarizeButton } from "./summarize-button";
import { SummarizedContent } from "./summarized-content";
import { SummarySkeleton } from "./summary-skeleton";

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
			<div className="relative text-sm mt-1 p-2 border">
				{summarized ? (
					<>
						<SummarizedContent content={summarized} />
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
					<div className="flex flex-col gap-2">
						<SummarizeButton
							className="w-full max-w-xs mx-auto"
							summarizing={summarizing}
							onClick={handleSummarize}
						/>
					</div>
				)}
				{summarizing && <SummarySkeleton className="mt-2" />}
			</div>
		</li>
	);
}
