import { pgTable, timestamp, unique, varchar } from "drizzle-orm/pg-core";

export const feed = pgTable(
	"feed",
	{
		id: varchar("id").primaryKey(),
		url: varchar("url").notNull(),
		timestamp: timestamp("timestamp").defaultNow(),
	},
	(t) => [unique().on(t.url)],
);

export const userFeed = pgTable(
	"user_feed",
	{
		id: varchar("id").primaryKey(),
		userId: varchar("user_id").notNull(),
		feedId: varchar("feed_id").notNull(),
		timestamp: timestamp("timestamp").defaultNow(),
	},
	(t) => [unique().on(t.userId, t.feedId)],
);

export const article = pgTable(
	"article",
	{
		id: varchar("id").primaryKey(),
		feedId: varchar("feed_id").notNull(),
		title: varchar("title").notNull(),
		link: varchar("link").notNull(),
		publishedAt: timestamp("published_at").notNull(),
		timestamp: timestamp("timestamp").defaultNow(),
	},
	(t) => [unique().on(t.feedId, t.link)],
);

export const userArticle = pgTable(
	"user_article",
	{
		id: varchar("id").primaryKey(),
		userId: varchar("user_id").notNull(),
		articleId: varchar("article_id").notNull(),
		summary: varchar("summary").notNull(),
		timestamp: timestamp("timestamp").defaultNow(),
	},
	(t) => [unique().on(t.userId, t.articleId)],
);

export const userSetting = pgTable(
	"user_setting",
	{
		id: varchar("id").primaryKey(),
		userId: varchar("user_id").notNull(),
		summaryLength: varchar("summary_length").notNull().default("short"),
		summaryLanguage: varchar("summary_language").notNull().default("english"),
		customInstructions: varchar("custom_instructions").notNull().default(""),
		timestamp: timestamp("timestamp").defaultNow(),
	},
	(t) => [unique().on(t.userId)],
);
