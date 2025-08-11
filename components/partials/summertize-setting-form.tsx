"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { SummaryLengthOptions } from "@/lib/const";
import type { ArticleWithFeed } from "@/lib/types";
import {
	PreviewSummarizeAction,
	SaveSummarySettingAction,
} from "@/server/controllers/actions";
import { SummarizeButton } from "../shared/summarize-button";
import { SummarizedContent } from "../shared/summarized-content";
import { SummarySkeleton } from "../shared/summary-skeleton";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const Languages = ["English", "Japanese", "Chinese", "Korean", "Spanish"];

export function SummarizeSettingForm({
	language: initialLanguage,
	length: initialLength,
	customInstructions: initialCustomInstructions,
	articles,
}: {
	language: string;
	length: string;
	customInstructions: string;
	articles: ArticleWithFeed[];
}) {
	const [saved, setSaved] = useState({
		language: initialLanguage,
		length: initialLength,
		customInstructions: initialCustomInstructions,
	});
	const [language, setLanguage] = useState(initialLanguage);
	const [length, setLength] = useState(initialLength);
	const [customInstructions, setCustomInstructions] = useState(
		initialCustomInstructions,
	);
	const onChanged =
		language !== saved.language ||
		length !== saved.length ||
		customInstructions !== saved.customInstructions;

	const [previewArticle, setPreviewArticle] = useState(
		articles[0] || undefined,
	);
	const [dialogOpen, setDialogOpen] = useState(false);

	const [summarizing, setSummarizing] = useState(false);
	const [summarized, setSummarized] = useState("");

	const handleSave = async () => {
		await SaveSummarySettingAction({
			language,
			length,
			customInstructions,
		});
		setSaved({
			language,
			length,
			customInstructions,
		});
		// Here you would typically send the data to your backend or save it in some state management
	};

	const handleSummarize = async () => {
		if (!previewArticle) {
			return;
		}
		// Logic to handle summarization, e.g., calling an API or processing the text
		setSummarizing(true);
		const previewResponse = await PreviewSummarizeAction({
			language,
			length,
			customInstructions,
			articleId: previewArticle.id,
		});
		setSummarized(previewResponse);
		setSummarizing(false);
	};

	const handleArticleSelect = (articleId: string) => {
		const selectedArticle = articles.find(
			(article) => article.id === articleId,
		);
		if (selectedArticle) {
			setPreviewArticle(selectedArticle);
			setDialogOpen(false);
		}
	};
	return (
		<div className="flex flex-col md:flex-row divide-border">
			<div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden break-words whitespace-pre-wrap">
				<div className="flex flex-col gap-2">
					<Label className="mb-auto font-bold">Language</Label>
					<div className="flex-1 flex flex-col gap-1">
						<Input
							placeholder="English"
							value={language}
							onChange={(e) => setLanguage(e.target.value)}
						/>
						<div className="flex flex-row gap-2 flex-wrap">
							{Languages.map((lang) => (
								<Button
									key={lang}
									size={"badge"}
									onClick={() => setLanguage(lang)}
								>
									{lang.toLowerCase()}
								</Button>
							))}
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="mb-auto font-bold">Length</Label>
					<RadioGroup value={length} onValueChange={setLength}>
						{Object.entries(SummaryLengthOptions).map(([value, label]) => (
							<div key={value} className="flex items-center gap-3">
								<RadioGroupItem value={value} id={value} />
								<Label htmlFor={value}>{label}</Label>
							</div>
						))}
					</RadioGroup>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="mb-auto font-bold">Custom Instructions</Label>
					<Input
						value={customInstructions}
						onChange={(e) => setCustomInstructions(e.target.value)}
					/>
				</div>
				<Button
					onClick={handleSave}
					disabled={!onChanged}
					variant={onChanged ? "highlight" : "default"}
				>
					Save
				</Button>
			</div>
			<div className="flex-1 truncate flex flex-col p-4 gap-2 border-4 bg-foreground/10 border-dotted m-2">
				<h2 className="font-bold">Summary Preview</h2>
				<div className="flex flex-col gap-2">
					<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
						<DialogTrigger asChild>
							<Button>Select Preview Article</Button>
						</DialogTrigger>
						<DialogContent className="overflow-hidden">
							<DialogHeader>
								<DialogTitle>Select Preview Article</DialogTitle>
								<DialogDescription>Select an example article</DialogDescription>
							</DialogHeader>
							<ScrollArea className="max-h-96 px-4">
								<ScrollBar orientation="horizontal" />
								<ScrollBar orientation="vertical" />
								<div className="flex flex-col gap-2">
									{articles.map((article) => (
										<div
											className="flex flex-col gap-1 text-left whitespace-pre-wrap border-2 border-l-4 p-2"
											key={article.id}
										>
											<p className="text-xs text-muted-foreground line-clamp-1 break-all whitespace-pre-wrap">
												{article.feed.title}
											</p>
											<div className="flex flex-row gap-2">
												<Button
													onClick={() => handleArticleSelect(article.id)}
													className="text-left"
												>
													Select
												</Button>
												<p className="flex-1 line-clamp-2 text-wrap whitespace-pre-wrap">
													{article.title}
												</p>
											</div>
											<a
												className="text-xs text-muted-foreground underline line-clamp-1 break-all whitespace-pre-wrap"
												href={article.url}
												target="_blank"
												rel="noopener noreferrer"
											>
												{article.url}
											</a>
										</div>
									))}
								</div>
							</ScrollArea>
						</DialogContent>
					</Dialog>
				</div>
				<div className="font-light text-sm line-clamp-1 break-all whitespace-pre-wrap">
					Preview Article:{" "}
					<a
						className="font-medium underline"
						href={previewArticle.url}
						target="_blank"
					>
						{previewArticle.title}
					</a>
				</div>
				<SummarizeButton
					disabled={previewArticle === undefined || summarizing}
					onClick={handleSummarize}
					summarizing={summarizing}
				/>
				<ScrollArea className="overflow-y-hidden border p-2 text-wrap">
					{summarizing ? (
						<SummarySkeleton />
					) : (
						<SummarizedContent content={summarized} />
					)}
					<ScrollBar orientation="vertical" />
				</ScrollArea>
			</div>
		</div>
	);
}
