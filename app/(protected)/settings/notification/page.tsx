import { SummarizeSettingForm } from "@/components/partials/summertize-setting-form";
import { Separator } from "@/components/ui/separator";
import { db } from "@/database";
import { getUserId } from "@/lib/auth";
import { ListTimelineArticle } from "@/server/queries/list-timeline-article";

export default async function Home() {
	const userId = await getUserId();
	const articles = await ListTimelineArticle({ userId });
	const setting = await db.query.userSetting.findFirst({
		where: (userSetting, { eq }) => eq(userSetting.userId, userId),
	});
	return (
		<div>
			<h1 className="text-2xl font-bold pb-2">Notification</h1>
			<Separator />
			<SummarizeSettingForm
				language={setting?.summaryLanguage ?? "english"}
				length={setting?.summaryLength ?? "short"}
				customInstructions={setting?.summaryInstructions ?? ""}
				articles={articles}
			/>
		</div>
	);
}
