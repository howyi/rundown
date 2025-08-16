import { RenderedMarkdown } from "../shared/rendered-markdown";

const DESCRIPTION = `
rundown crawls your subscribed RSS feeds every 15 minutes, detects new or updated articles, and generates AI-powered summaries.
You can customize the summary language and length, and receive notifications via Slack and Discord Webhooks.

[GitHub](https://github.com/howyi/rundown) 

---

## Key Features

### RSS Feed Registration & Management

* Register and manage multiple RSS feeds in one place.
* Simple UI for adding, editing, and deleting feeds.

![RSS Feed Registration](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2fd4crqjtcgnflzv6o8o.png)

### Update Detection + AI Summarization

* Checks feeds every 15 minutes for new articles.
* Summarizes using **gpt-5-nano** with multi-language and adjustable length options.

![AI Summarization](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6ogghc2n78ife7k0pdon.gif)

### Timeline View

* Browse summarized articles in chronological order.
* Easily access past articles.

![Timeline](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ra9g6ldpiq3dd7d6wtbq.png)

### Slack & Discord Webhook Notifications

* Get instant updates in your Slack and Discord channels.
* Ideal for teams and communities.

![Discord Webhook Notifications](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1aae1g7ytkh5556mtoz9.png)

### MCP Integration

* Access feed and article data programmatically via the MCP server.
* Connect to \`rundown.sbox.studio/mcp\` using an API key generated from the settings page.

![MCP Integration](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/17450f6wwhtndbzfjs6s.png)
`;

export function ProductDescription() {
	return <RenderedMarkdown>{DESCRIPTION}</RenderedMarkdown>;
}
