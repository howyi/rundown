"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const SignOutButton = () => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	async function handleSignOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					startTransition(() => {
						router.push("/");
					});
				},
			},
		});
	}
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					size={"sm"}
					variant={"outline"}
					onClick={handleSignOut}
					disabled={isPending}
				>
					<LogOut />
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>Sign out</p>
			</TooltipContent>
		</Tooltip>
	);
};
