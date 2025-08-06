"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function AddRssFeed(): Promise<void> {
	console.log("AddRssFeed called");
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	console.log("session2", session?.user.id);
}
