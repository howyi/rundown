import { LoaderCircle, Sparkles } from "lucide-react";
import type React from "react";
import { Button } from "../ui/button";

export function SummarizeButton({
	summarizing,
	...props
}: React.ComponentPropsWithoutRef<"button"> & { summarizing?: boolean }) {
	return (
		<Button disabled={summarizing} {...props}>
			{summarizing ? (
				<>
					<LoaderCircle className="animate-spin" />
					Summarizing...
				</>
			) : (
				<>
					<Sparkles />
					Summarize
				</>
			)}
		</Button>
	);
}
