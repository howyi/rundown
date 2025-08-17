"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

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
		<Button
			size={"sm"}
			variant={"destructive"}
			className="max-w-[200px]"
			onClick={handleSignOut}
			disabled={isPending}
		>
			Sign out
		</Button>
	);
};
