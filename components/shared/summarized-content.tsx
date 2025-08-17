import Markdown from "react-markdown";

export function SummarizedContent({ content }: { content: string }) {
	return (
		<div className="wrap-break-word prose dark:prose-invert max-w-none prose-a:text-blue-400">
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

// biome-ignore lint/suspicious/noExplicitAny: anchor tag needs any type for props
const AnchorTag = ({ node, children, ...props }: any) => {
	try {
		new URL(props.href ?? "");
		props.target = "_blank";
		props.rel = "noopener noreferrer";
	} catch (_e) {}
	return <a {...props}>{children}</a>;
};
