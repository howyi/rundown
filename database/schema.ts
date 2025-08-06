import {
	integer,
	pgTable,
	serial,
	timestamp,
	unique,
	varchar,
} from "drizzle-orm/pg-core";

export const spw = pgTable(
	"spw",
	{
		id: serial("id").primaryKey(),
		teamId: varchar("team_id", { length: 255 }).notNull(),
		name: varchar("name").notNull(),
		spw: integer("spw").notNull(),
		timestamp: timestamp("timestamp").defaultNow(),
	},
	(t) => [unique().on(t.teamId, t.name)],
);
