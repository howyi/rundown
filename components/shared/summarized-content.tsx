import Markdown from "react-markdown";

export function SummarizedContent({ content }: { content: string }) {
	return (
		<div className="prose prose-sm dark:prose-invert max-w-none prose-a:text-blue-400">
			<Markdown
				components={{
					a: AnchorTag,
				}}
			>
				{content}
			</Markdown>
		</div>
	);
}

const AnchorTag = ({ node, children, ...props }: any) => {
	try {
		new URL(props.href ?? "");
		props.target = "_blank";
		props.rel = "noopener noreferrer";
	} catch (e) {}
	return <a {...props}>{children}</a>;
};
