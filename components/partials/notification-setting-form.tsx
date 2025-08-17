"use client";

import type { Installation } from "@slack/bolt";
import { Bell, LoaderCircle } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
	AddDiscordWebhookAction,
	RemoveSlackInstallationAction,
	TestNotificationAction,
} from "@/server/controllers/actions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function NotificationSettingForm({
	notificationDiscordWebhookUrl,
	notificationSlackInstallation,
}: {
	notificationDiscordWebhookUrl: string;
	notificationSlackInstallation: Installation | null;
}) {
	return (
		<div className="flex-1 flex flex-col gap-2 p-4 overflow-hidden break-words whitespace-pre-wrap">
			<DiscordWebhookForm
				notificationDiscordWebhookUrl={notificationDiscordWebhookUrl}
			/>
			<Label className="mb-auto font-bold flex-1 my-auto">Slack Webhook</Label>
			{notificationSlackInstallation ? (
				<RemoveSlackInstallationButton />
			) : (
				<SlackInstallationForm
					notificationSlackInstallation={notificationSlackInstallation}
				/>
			)}
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
					Save
				</Button>
			</div>
		</form>
	);
}

function SlackInstallationForm({
	notificationSlackInstallation,
}: {
	notificationSlackInstallation: Installation | null;
}) {
	return (
		<div className="flex flex-col gap-2">
			<Button asChild className="max-w-sm">
				<a href={`/api/slack/install`}>
					{notificationSlackInstallation
						? "ReInstall Slack App"
						: "Install Slack App"}
				</a>
			</Button>
		</div>
	);
}

function RemoveSlackInstallationButton() {
	const [state, formAction, pending] = useActionState(
		RemoveSlackInstallationAction,
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
				Remove Slack Webhook
			</Button>
		</form>
	);
}
