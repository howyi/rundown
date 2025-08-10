"use client";

import Link from "next/link";
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
import type { Article } from "@/lib/types";
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
	articles: Article[];
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
		<div className="flex flex-col lg:flex-row divide-border">
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
							<Button variant={"outline"}>Select PreviewArticle</Button>
						</DialogTrigger>
						<DialogContent className="overflow-cl">
							<DialogHeader>
								<DialogTitle>Select PreviewArticle from Timeline</DialogTitle>
								<DialogDescription>
									Select an article from the{" "}
									<Link className="underline" href={"/timeline"}>
										timeline
									</Link>{" "}
									to use for preview. If there are no articles, please add RSS
									feeds from the{" "}
									<Link className="underline" href={"/feeds"}>
										Feed List
									</Link>
									.
								</DialogDescription>
							</DialogHeader>
							<ScrollArea className="max-h-96 px-4">
								<ScrollBar orientation="vertical" />
								<div className="flex flex-col gap-2">
									{articles.map((article) => (
										<div
											className="justify-start text-left whitespace-pre-wrap border-2 border-l-4 p-2"
											key={article.id}
										>
											<Button
												variant="outline"
												onClick={() => handleArticleSelect(article.id)}
												className="w-full text-left"
											>
												Select Article
											</Button>
											{article.title}
										</div>
									))}
								</div>
							</ScrollArea>
						</DialogContent>
					</Dialog>
					{/* <Select value={previewArticleId} onValueChange={setPreviewArticleId}>
						<SelectTrigger className="w-full">
							<SelectValue
								placeholder="Select an article"
								className="truncate"
							/>
						</SelectTrigger>
						<SelectContent className="w-full max-w-200">
							{articles.map((article) => (
								<SelectItem
									key={article.id}
									value={article.id}
									onClick={() => setPreviewArticleId(article.id)}
								>
									{article.title}
								</SelectItem>
							))}
						</SelectContent>
					</Select> */}
				</div>
				<div className="whitespace-pre-wrap font-light text-sm">
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
			{/* Add form elements here */}
		</div>
	);
}
