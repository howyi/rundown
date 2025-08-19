import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { OrganizationSettingForm } from "@/components/partials/organization-setting-form";
import { SignOutButton } from "@/components/partials/sign-out-button";
import { Header } from "@/components/shared/header";
import { Separator } from "@/components/ui/separator";
import { db } from "@/database";
import { auth } from "@/lib/auth";
import { UserDeleteButton } from "@/components/partials/user-delete-button";

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ invitation?: string; status?: string }>;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const searchParamsValues = await searchParams;
	const code = searchParamsValues.invitation;
	if (code) {
		try {
			const invitation = await db.query.publicInvitation.findFirst({
				where: (invitation, { eq }) => eq(invitation.code, code),
			});
			if (invitation) {
				await auth.api.addMember({
					body: {
						userId: session?.user.id ?? "",
						role:
							invitation?.role &&
							["member", "admin", "owner"].includes(invitation.role)
								? [invitation.role as "member" | "admin" | "owner"]
								: [],
						organizationId: invitation.organizationId,
					},
				});
				// remove query parameter from URL
				redirect(`/account?status=invitation_accepted`);
			}
		} catch (error) {
			console.error("Failed to accept invitation:", error);
			redirect(`/account?status=invitation_error`);
		}
	}

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

	return (
		<div className="flex flex-col gap-2">
			<Header title="Account" />
			<h1 className="text-lg font-bold">User</h1>
			{session?.user.email}
			<SignOutButton />
			<UserDeleteButton />
			<Separator className="my-2" />
			<h1 className="text-lg font-bold">Organization</h1>
			<OrganizationSettingForm
				status={searchParamsValues.status}
				invitations={await Promise.all(invitations)}
			/>
		</div>
	);
}
