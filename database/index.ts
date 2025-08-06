import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// biome-ignore lint/style/noNonNullAssertion: required
const postgresUrl = process.env.POSTGRES_URL!;

export const db = drizzlePg(postgresUrl, { schema, logger: true });
