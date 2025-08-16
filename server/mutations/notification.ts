import { IncomingWebhook } from "@slack/webhook";
import type { userSetting } from "@/database/schema/app";

export async function Notification({
	feedTitle,
	feedUrl,
	articleTitle,
	articleUrl,
	articleSummary,
	setting,
}: {
	feedTitle?: string;
	feedUrl?: string;
	articleTitle?: string;
	articleUrl: string;
	articleSummary: string;
	setting: typeof userSetting.$inferSelect;
}): Promise<void> {
	if (setting.notificationDiscordWebhookUrl) {
		// see: https://discord.com/developers/docs/resources/webhook#execute-webhook-jsonform-params
		await fetch(setting.notificationDiscordWebhookUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				// content: `New summary from user ${userId}: ${summary}`,
				embeds: [
					{
						title: articleTitle,
						url: articleUrl,
						description: articleSummary,
						color: 0x00ff00, // Green color
						author: { name: feedTitle, url: feedUrl },
					},
				],
			}),
		});
	}
	if (setting.notificationSlackInstallation?.incomingWebhook?.url) {
		const webhook = new IncomingWebhook(
			setting.notificationSlackInstallation.incomingWebhook.url,
		);
		await webhook.send({
			text: articleUrl,
			attachments: [
				{
					mrkdwn_in: ["text"],
					title: articleTitle,
					title_link: articleUrl,
					text: articleSummary,
					color: "#57b5ac",
					author_name: feedTitle,
					author_link: feedUrl,
				},
			],
		});
	}
}
