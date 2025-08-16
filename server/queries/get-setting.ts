import { db } from "@/database";
import { userSetting } from "@/database/schema/app";

export async function GetSetting(
	userId: string,
): Promise<typeof userSetting.$inferSelect> {
	const foundSetting = await db.query.userSetting.findFirst({
		where: (setting, { eq }) => eq(setting.userId, userId),
	});
	if (foundSetting) {
		return foundSetting;
	}

	await db.insert(userSetting).values({ userId });

	const insertedSetting = await db.query.userSetting.findFirst({
		where: (setting, { eq }) => eq(setting.userId, userId),
	});
	if (!insertedSetting) {
		throw new Error("Failed to create user setting");
	}
	return insertedSetting;
}
