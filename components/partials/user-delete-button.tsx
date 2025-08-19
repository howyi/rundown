"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { ConfirmButton } from "./confirm-button";

export const UserDeleteButton = () => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	async function handleDeleteAccount() {
		await authClient.deleteUser({
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
		<ConfirmButton
			size={"sm"}
			variant={"destructive"}
			className="max-w-[200px]"
			onConfirm={handleDeleteAccount}
			disabled={isPending}
			title="Are you sure you want to delete your account? This action cannot be undone."
			description="This will permanently delete your account and all associated data. If you are a member of any organization, you must leave the organization before deleting your account."
		>
			Delete Account
		</ConfirmButton>
	);
};
