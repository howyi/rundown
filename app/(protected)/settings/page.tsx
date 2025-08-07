import { SummarizeSettingForm } from "@/components/partials/summertize-setting-form";
import { Separator } from "@/components/ui/separator";
import { getUserId } from "@/lib/auth";
import { ListTimelineArticle } from "@/server/queries/list-timeline-article";

export default async function Home() {
	const userId = await getUserId();
	const articles = await ListTimelineArticle({ userId });
	return (
		<div>
			<Section title="Summarize">
				<SummarizeSettingForm
					language="English"
					length="short"
					customInstructions=""
					articles={articles}
				/>
			</Section>
			{/* <Section title="Notifications">Notifications</Section> */}
		</div>
	);
}

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<h1 className="text-2xl font-bold pb-2">{title}</h1>
			<Separator />
			{children}
		</div>
	);
}
