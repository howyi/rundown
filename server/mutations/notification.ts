export async function Notification({
	feedTitle,
	feedUrl,
	articleTitle,
	articleUrl,
	articleSummary,
	discordWebhookUrl,
}: {
	feedTitle?: string;
	feedUrl?: string;
	articleTitle?: string;
	articleUrl: string;
	articleSummary: string;
	discordWebhookUrl?: string;
}): Promise<void> {
	if (discordWebhookUrl) {
		// see: https://discord.com/developers/docs/resources/webhook#execute-webhook-jsonform-params
		await fetch(discordWebhookUrl, {
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
}
