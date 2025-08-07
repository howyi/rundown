export type FeedId = string;
export type Feed = {
	id: FeedId;
	title: string;
	url: string;
	description: string;
};

export type ArticleId = string;

export type Article = {
	id: ArticleId;
	title: string;
	url: string;
	summary: string;
	publishedAt: Date;
};

export type FeedWithArticles = Feed & {
	articles: ArticleWithFeed[];
};

export type ArticleWithFeed = Article & {
	feed: Feed;
};
