import { headers } from "next/headers";
import { OrganizationSettingForm } from "@/components/partials/organization-setting-form";
import { SignOutButton } from "@/components/partials/sign-out-button";
import { Header } from "@/components/shared/header";
import { Separator } from "@/components/ui/separator";
import { db } from "@/database";
import { auth } from "@/lib/auth";

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const invitations = (
		await auth.api.listUserInvitations({
			query: {
				email: session?.user.email ?? "",
			},
		})
	)
		.filter((invitation) => invitation.status === "pending")
		.map(async (invitation) => {
			const org = await db.query.organization.findFirst({
				where: (organization, { eq }) =>
					eq(organization.id, invitation.organizationId),
			});
			return {
				id: invitation.id,
				name: org?.name ?? "Unknown Organization",
			};
		});
	console.log("invitations", invitations); // Debugging line to check invitations
	return (
		<div className="flex flex-col gap-2">
			<Header title="Account" />
			<h1 className="text-lg font-bold">User</h1>
			<SignOutButton />
			<Separator className="my-2" />
			<h1 className="text-lg font-bold">Organization</h1>
			<OrganizationSettingForm invitations={await Promise.all(invitations)} />
		</div>
	);
}
