"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type ActionState, AddFeedAction } from "@/server/controllers/actions";

const initialState: ActionState = {};

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
			<form className="flex flex-row gap-2 " action={formAction}>
				<Input placeholder="Enter RSS URL" name="url" autoFocus />
				<Button disabled={pending}>
					{pending ? <LoaderCircle className="animate-spin" /> : <Plus />}
					Add Feed
				</Button>
			</form>
		</div>
	);
}
