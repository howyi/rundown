"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { UnsubscribeAction } from "@/server/controllers/actions";
import { Button } from "../ui/button";

export function SubscribeButton({ feedId }: { feedId: string }) {
	// マウスホバーしたら文言がUnsubscribeに変わる
	const [isHovered, setIsHovered] = useState(false);

	const [state, formAction, pending] = useActionState(UnsubscribeAction, {});

	useEffect(() => {
		if (state?.error) {
			toast.error(state.error);
		}
	}, [state]);

	return (
		<form action={formAction}>
			<input type="hidden" name="feedId" value={feedId} />
			<Button
				variant={"secondary"}
				type="submit"
				disabled={pending}
				className="row-span-4 my-auto hover:border-destructive hover:text-destructive"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{isHovered ? "Unsubscribe" : "Subscribed"}
			</Button>
		</form>
	);
}
