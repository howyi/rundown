"use client";

import { useState } from "react";
import { SummaryLengthOptions } from "@/lib/const";
import type { Article } from "@/lib/types";
import {
	PreviewSummarizeAction,
	SaveSummarySettingAction,
} from "@/server/controllers/actions";
import { SummarizeButton } from "../shared/summarize-button";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";

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

	const [previewArticleId, setPreviewArticleId] = useState(
		"a_IkENBADFsUPR_fp0-rGKz",
	);

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
		// Logic to handle summarization, e.g., calling an API or processing the text
		setSummarizing(true);
		const previewResponse = await PreviewSummarizeAction({
			language,
			length,
			customInstructions,
			articleId: previewArticleId,
		});
		setSummarized(previewResponse);
		setSummarizing(false);
	};
	return (
		<div className="flex flex-row divide-x-1 divide-border">
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
			<div className="flex-1 flex flex-col p-4 gap-2">
				<h2 className="font-bold">Summary Preview</h2>
				<div className="flex flex-col gap-2">
					<Label className="flex-shrink-0 mb-auto font-bold">
						Preview Article:
					</Label>
					<Select value={previewArticleId} onValueChange={setPreviewArticleId}>
						<SelectTrigger className="w-full min-w-0 max-w-40 overflow-hidden">
							<SelectValue placeholder="Select an article" />
						</SelectTrigger>
						<SelectContent>
							{articles.map((article) => (
								<SelectItem
									key={article.id}
									value={article.id}
									className="max-h-[200px]"
									onClick={() => setPreviewArticleId(article.id)}
								>
									{article.title}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<SummarizeButton
					disabled={previewArticleId === "" || summarizing}
					onClick={handleSummarize}
					summarizing={summarizing}
				/>
				<ScrollArea className="overflow-y-hidden border p-2">
					{summarizing ? (
						<div className="space-y-2 py-2">
							<Skeleton className="h-4" />
							<Skeleton className="h-4 w-[50%]" />
							<Skeleton className="h-4 w-[70%]" />
							<Skeleton className="h-4 w-[40%]" />
						</div>
					) : (
						<p className="whitespace-pre-wrap text-xs">{summarized}</p>
					)}
					<ScrollBar orientation="vertical" />
				</ScrollArea>
			</div>
			{/* Add form elements here */}
		</div>
	);
}
