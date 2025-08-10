import { McpSettingForm } from "@/components/partials/mcp-setting-form";
import { Separator } from "@/components/ui/separator";
import { db } from "@/database";
import { getUserId } from "@/lib/auth";

export default async function Home() {
	const userId = await getUserId();
	const setting = await db.query.userSetting.findFirst({
		where: (userSetting, { eq }) => eq(userSetting.userId, userId),
	});
	return (
		<div>
			<h1 className="text-2xl font-bold pb-2">MCP</h1>
			<Separator />
			<McpSettingForm mcpApiKey={setting?.mcpApiKey ?? ""} />
		</div>
	);
}
