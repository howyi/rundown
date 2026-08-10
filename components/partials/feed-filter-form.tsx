"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaveFeedFilterAction } from "@/server/controllers/actions";

export function FeedFilterForm({
	feedId,
	excludedTitleKeywords,
}: {
	feedId: string;
	excludedTitleKeywords: string;
}) {
	const [state, formAction, pending] = useActionState(SaveFeedFilterAction, {});

	useEffect(() => {
		if (state.error) {
			toast.error(state.error);
		}
		if (state.success) {
			toast.success(state.success);
		}
	}, [state]);

	return (
		<form action={formAction} className="flex flex-col gap-2 py-4">
			<input type="hidden" name="feedId" value={feedId} />
			<Label htmlFor="excludedTitleKeywords" className="font-bold">
				Title filter
			</Label>
			<p className="text-sm text-muted-foreground">
				Articles whose title contains any of these keywords will not be added.
				Separate keywords with commas.
			</p>
			<div className="flex flex-col gap-2 sm:flex-row">
				<Input
					id="excludedTitleKeywords"
					name="excludedTitleKeywords"
					defaultValue={excludedTitleKeywords}
					placeholder="canary, beta"
					maxLength={2000}
				/>
				<Button type="submit" disabled={pending}>
					{pending ? (
						<LoaderCircle data-icon="inline-start" className="animate-spin" />
					) : (
						<Save data-icon="inline-start" />
					)}
					Save
				</Button>
			</div>
		</form>
	);
}
