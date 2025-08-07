"use client";

import { Plus } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	AddFeedAction,
	type AddFeedFormState,
} from "@/server/controllers/actions";

const initialState: AddFeedFormState = {};

export default function AddFeedForm() {
	const [state, formAction, pending] = useActionState(
		AddFeedAction,
		initialState,
	);

	useEffect(() => {
		if (state?.error) {
			toast.error(state.error);
		}
	}, [state]);

	return (
		<div>
			<form className="flex flex-row gap-2" action={formAction}>
				<Input
					placeholder="Enter feed URL"
					name="url"
					defaultValue={"https://thisweekinreact.com/newsletter/rss.xml"}
				/>
				<Button disabled={pending}>
					<Plus />
					Add Feed
				</Button>
			</form>
		</div>
	);
}
