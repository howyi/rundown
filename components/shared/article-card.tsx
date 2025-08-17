"use client";

import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
		<li className="px-4 py-2 flex flex-col gap-2 bg-card border-2 border-l-4 shadow-md">
			<div className="flex flex-row gap-2 text-xs italic text-muted-foreground">
				<div className="flex-1">
					<Link href={`/feeds/${article.feed.id}`} className=" hover:underline">
						{article.feed.title}
					</Link>
					{"  -  "}
					<a
						className="hover:underline"
						href={article.feed.url}
						target="_blank"
						rel="noopener noreferrer"
					>
						{article.feed.url}
					</a>
				</div>
				<span className=" text-gray-500">
					{new Date(article.publishedAt).toLocaleDateString()}
				</span>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant={"ghost"}
							onClick={handleRemoveSummary}
							size="sm"
							className="text-muted-foreground text-xs h-4"
						>
							<Ellipsis />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem asChild>
							<a href={article.url} target="_blank" rel="noopener noreferrer">
								Open URL
							</a>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link
								href={`/feeds/${article.feed.id}`}
								target="_blank"
								className="w-full"
							>
								Go to Feed page
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleRemoveSummary}>
							Reset Summary
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								href={`/settings/summarize`}
								target="_blank"
								className="w-full"
							>
								Change summarize settings
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />

						<DropdownMenuSub>
							<DropdownMenuSubTrigger>Copy to Clipboard</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem
										onClick={() => navigator.clipboard.writeText(article.url)}
									>
										URL
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => navigator.clipboard.writeText(article.id)}
									>
										Article ID
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() =>
											navigator.clipboard.writeText(article.feed.id)
										}
									>
										Feed ID
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<Link
				target="_blank"
				href={article.url}
				className="font-bold hover:underline"
			>
				{article.title}
			</Link>
			<div className="relative mt-1 p-2 border">
				{summarized ? (
					<SummarizedContent content={summarized} />
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
