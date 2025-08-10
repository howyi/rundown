import OpenAI from "openai";
import { db } from "@/database";
import { type article, userArticle } from "@/database/schema/app";
import { SummaryLengthOptions } from "@/lib/const";

const openai = new OpenAI();

export async function Summarize({
	userId,
	language = "english",
	length = "medium",
	customInstructions = "",
	articleRecord,
}: {
	userId: string;
	language?: string;
	length?: string;
	customInstructions?: string;
	articleRecord: typeof article.$inferInsert;
}): Promise<string> {
	const response = await openai.responses.create({
		model: "gpt-5-nano",
		input:
			"以下の記事内容を要約してください。レスポンスは記事の概要のみを返してください。敬語は不要です \n リンクのついた文字列があった場合はマークダウン形式に変換してください\n " +
			`記事タイトル: ${articleRecord.title}\n` +
			`記事内容: ${articleRecord.content}\n` +
			`要約の言語: ${language}\n` +
			`要約の長さ: ${SummaryLengthOptions[length] ?? "未指定"}\n` +
			`カスタム指示: ${customInstructions}\n`,
	});
	const summary = response.output_text;

	const userArticleRecord: typeof userArticle.$inferInsert = {
		userId,
		articleId: articleRecord.id,
		summary,
	};

	await db
		.insert(userArticle)
		.values(userArticleRecord)
		.onConflictDoUpdate({
			target: [userArticle.userId, userArticle.articleId],
			set: userArticleRecord,
		});

	return summary;
}
