import { relations } from "drizzle-orm";
import {
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
	varchar,
} from "drizzle-orm/pg-core";

export const feed = pgTable(
	"feed",
	{
		id: varchar("id").primaryKey(),
		title: varchar("title").notNull(),
		description: text("description").notNull(),
		url: varchar("url"),
		rssUrl: varchar("rss_url").notNull(),
		timestamp: timestamp("timestamp").defaultNow(),
	},
	(t) => [unique().on(t.rssUrl)],
);

export const userFeed = pgTable(
	"user_feed",
	{
		userId: varchar("user_id").notNull(),
		feedId: varchar("feed_id").notNull(),
		timestamp: timestamp("timestamp").defaultNow(),
	},
	(t) => [primaryKey({ columns: [t.userId, t.feedId] })],
);

export const feedRelations = relations(feed, ({ many }) => ({
	userFeeds: many(userFeed),
	articles: many(article),
}));

export const userFeedRelations = relations(userFeed, ({ one }) => ({
	feed: one(feed, {
		fields: [userFeed.feedId],
		references: [feed.id],
	}),
}));

export const article = pgTable(
	"article",
	{
		id: varchar("id").primaryKey(),
		guid: varchar("guid").notNull(),
		feedId: varchar("feed_id").notNull(),
		title: varchar("title").notNull(),
		url: varchar("url").notNull(),
		content: text("content").notNull(),
		publishedAt: timestamp("published_at").notNull(),
		timestamp: timestamp("timestamp").defaultNow(),
	},
	(t) => [unique().on(t.guid, t.feedId)],
);

export const userArticle = pgTable(
	"user_article",
	{
		userId: varchar("user_id").notNull(),
		articleId: varchar("article_id").notNull(),
		summary: varchar("summary").notNull(),
		timestamp: timestamp("timestamp").defaultNow(),
	},
	(t) => [primaryKey({ columns: [t.userId, t.articleId] })],
);

export const articleRelations = relations(article, ({ one, many }) => ({
	userArticles: many(userArticle),
	feed: one(feed, {
		fields: [article.feedId],
		references: [feed.id],
	}),
}));

export const userArticleRelations = relations(userArticle, ({ one }) => ({
	article: one(article, {
		fields: [userArticle.articleId],
		references: [article.id],
	}),
}));

export const userSetting = pgTable("user_setting", {
	userId: varchar("user_id").primaryKey(),
	summaryLength: varchar("summary_length").notNull().default("short"),
	summaryLanguage: varchar("summary_language").notNull().default("english"),
	summaryInstructions: varchar("summary_instructions").notNull().default(""),
	timestamp: timestamp("timestamp").defaultNow(),
});
