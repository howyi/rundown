"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { db } from "@/database";
import { userArticle, userSetting } from "@/database/schema/app";
import { getUserId } from "@/lib/auth";
import type { FeedId } from "@/lib/types";
import { AddFeed } from "../mutations/add-feed";
import { Summarize } from "../mutations/summarize";

export type AddFeedFormState = {
	error?: string;
};
export async function AddFeedAction(
	// biome-ignore lint/suspicious/noExplicitAny: unused
	_prevState: any,
	formData: FormData,
): Promise<AddFeedFormState> {
	// zodでバリデーション
	const schema = z.object({
		url: z.url(),
	});
	const result = schema.safeParse(Object.fromEntries(formData));
	if (!result.success) {
		return { error: "Invalid feed URL" };
	}
	const userId = await getUserId();
	await AddFeed({
		userId,
		url: result.data.url,
	});
	revalidatePath("/feeds");
	return {};
}

export async function DeleteFeed({ id }: { id: FeedId }): Promise<void> {
	const userId = await getUserId();
	console.log("DeleteFeed", userId, id);
}

export async function SaveSummarySettingAction(params: {
	language: string;
	length: string;
	customInstructions: string;
}): Promise<void> {
	const userId = await getUserId();
	const setting = await db.query.userSetting.findFirst({
		where: (setting, { eq }) => eq(setting.userId, userId),
	});
	if (setting) {
		await db
			.update(userSetting)
			.set({
				summaryLanguage: params.language,
				summaryLength: params.length,
				summaryInstructions: params.customInstructions,
			})
			.where(eq(userSetting.userId, userId));
	} else {
		await db.insert(userSetting).values({
			userId,
			summaryLanguage: params.language,
			summaryLength: params.length,
			summaryInstructions: params.customInstructions,
		});
	}
}

export async function SummarizeAction(params: {
	articleId: string;
}): Promise<string> {
	const userId = await getUserId();
	const setting = await db.query.userSetting.findFirst({
		where: (setting, { eq }) => eq(setting.userId, userId),
	});
	return Summarize({
		userId,
		articleId: params.articleId,
		language: setting?.summaryLanguage || "english",
		length: setting?.summaryLength || "medium",
		customInstructions: setting?.summaryInstructions || "",
	});
}

export async function RemoveSummaryAction(params: {
	articleId: string;
}): Promise<void> {
	const userId = await getUserId();
	await db
		.delete(userArticle)
		.where(
			and(
				eq(userArticle.userId, userId),
				eq(userArticle.articleId, params.articleId),
			),
		);
}

export async function PreviewSummarizeAction(params: {
	language: string;
	length: string;
	customInstructions: string;
	articleId: string;
}): Promise<string> {
	const userId = await getUserId();
	return Summarize({
		userId,
		articleId: params.articleId,
		language: params.language,
		length: params.length,
		customInstructions: params.customInstructions,
	});
}
