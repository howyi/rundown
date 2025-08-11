import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import * as app from "./schema/app";
import * as auth from "./schema/auth";

// biome-ignore lint/style/noNonNullAssertion: required
const postgresUrl = process.env.POSTGRES_URL!;

export const db = drizzlePg(postgresUrl, {
	schema: { ...app, ...auth },
	logger: postgresUrl.includes("localhost"),
});
