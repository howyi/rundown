import Link from "next/link";
import { RenderedMarkdown } from "@/components/shared/rendered-markdown";
import { Button } from "@/components/ui/button";

export default function SimpleDocument({
	title,
	content,
}: {
	title: string;
	content: string;
}) {
	return (
		<div className="flex flex-col gap-2 w-full max-w-2xl mx-auto p-2">
			<Button variant="outline" className="w-full max-w-32">
				<Link href="/">📡 rundown</Link>
			</Button>
			<h1 className="text-2xl font-bold p-4 border-gray-600 bg-foreground/70 text-background border-2 border-l-8">
				{title}
			</h1>
			<div className="p-4 bg-card">
				<RenderedMarkdown>{content}</RenderedMarkdown>
			</div>
			<Button variant="outline" className="w-full max-w-32">
				<Link href="/">Back to Top</Link>
			</Button>
		</div>
	);
}
