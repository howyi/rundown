"use client";

import { Bell, LoaderCircle } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
	AddDiscordWebhookAction,
	TestNotificationAction,
} from "@/server/controllers/actions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function NotificationSettingForm({
	notificationDiscordWebhookUrl,
}: {
	notificationDiscordWebhookUrl: string;
}) {
	return (
		<div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden break-words whitespace-pre-wrap">
			<DiscordWebhookForm
				notificationDiscordWebhookUrl={notificationDiscordWebhookUrl}
			/>
			<TestNotificationButton />
		</div>
	);
}
function TestNotificationButton() {
	const [state, formAction, pending] = useActionState(
		TestNotificationAction,
		{},
	);

	useEffect(() => {
		if (state?.error) {
			toast.error(state.error);
		}
	}, [state]);
	return (
		<form action={formAction} className="flex flex-row gap-2">
			<Button type="submit" size="sm" disabled={pending}>
				{pending ? <LoaderCircle className="animate-spin" /> : <Bell />}
				Test Notification
			</Button>
		</form>
	);
}

function DiscordWebhookForm({
	notificationDiscordWebhookUrl,
}: {
	notificationDiscordWebhookUrl: string;
}) {
	const [state, formAction, pending] = useActionState(
		AddDiscordWebhookAction,
		{},
	);

	useEffect(() => {
		if (state?.error) {
			toast.error(state.error);
		}
	}, [state]);

	return (
		<form action={formAction} className="flex flex-col gap-2">
			<Label className="mb-auto font-bold flex-1 my-auto" htmlFor="url">
				Discord Webhook URL{" "}
				<span className="text-muted font-light">(empty to disable)</span>
			</Label>
			<div className="flex flex-row gap-2">
				<Input
					placeholder="Enter Discord Webhook URL"
					id="url"
					name="url"
					defaultValue={notificationDiscordWebhookUrl}
				/>
				<Button type="submit" disabled={pending}>
					Save Webhook URL
				</Button>
			</div>
		</form>
	);
}
