"use client";

import { Loader } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
	CreateOrganizationAction,
	GenerateInvitationCodeAction,
	RevokeInvitationCodeAction,
} from "@/server/controllers/actions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ConfirmButton } from "./confirm-button";

export function OrganizationSettingForm({
	invitations,
	status,
}: {
	invitations: {
		id: string;
		name: string;
	}[];
	status?: string;
}) {
	useEffect(() => {
		if (status === "invitation_accepted") {
			console.log("Invitation accepted successfully");
		} else if (status === "invitation_error") {
			console.error("Failed to accept invitation");
		}
	}, [status]);

	const { data: organizations } = authClient.useListOrganizations();
	return (
		<div className="flex flex-col gap-2">
			<h3 className="font-bold">Pending Invitations</h3>
			{invitations.length > 0 && (
				<ul className="flex flex-col gap-2">
					{invitations?.map((invitation) => (
						<li className="flex flex-row gap-2" key={invitation.id}>
							{invitation.name}
							<Button
								onClick={() => {
									toast.promise(
										authClient.organization.acceptInvitation({
											invitationId: invitation.id,
										}),
										{
											loading: "Accepting invitation...",
											success: () => {
												window.location.reload();
												return "Invitation accepted successfully";
											},
											error: (error) => `Failed to accept invitation: ${error}`,
										},
									);
								}}
							>
								accept
							</Button>
							<Button
								onClick={() => {
									toast.promise(
										authClient.organization.rejectInvitation({
											invitationId: invitation.id,
										}),
										{
											loading: "Rejecting invitation...",
											success: () => {
												window.location.reload();
												return "Invitation rejected successfully";
											},
											error: (error) => `Failed to reject invitation: ${error}`,
										},
									);
								}}
							>
								reject
							</Button>
						</li>
					))}
				</ul>
			)}
			<h3 className="font-bold">Your Organizations</h3>
			<ul className="flex flex-col gap-2">
				{organizations?.map((org) => (
					<OrganizationCard key={org.id} id={org.id} name={org.name} />
				))}
			</ul>
			<OrganizationCreateForm />
			{/* <TestNotificationButton /> */}
		</div>
	);
}
function OrganizationCard({ id, name }: { id: string; name: string }) {
	const { data: activeOrganization } = authClient.useActiveOrganization();
	const [inviteMail, setInviteMail] = useState("");
	const active = activeOrganization?.id === id;
	return (
		<li className="flex flex-col gap-2 border-2 p-2">
			<h3 className="text-lg font-bold">{name}</h3>
			<div className="flex flex-row gap-2">
				{active ? (
					<Button
						variant="outline"
						onClick={() => {
							toast.promise(
								authClient.organization.setActive({
									organizationId: null,
								}),
								{
									loading: "Setting deactive organization...",
									success: () => {
										window.location.reload();
										return "Organization set as inactive";
									},
									error: (error) => `Failed to save settings: ${error}`,
								},
							);
						}}
					>
						deactivate
					</Button>
				) : (
					<Button
						onClick={() => {
							toast.promise(
								authClient.organization.setActive({
									organizationId: id,
								}),
								{
									loading: "Setting active organization...",
									success: () => {
										window.location.reload();
										return "Organization set as active";
									},
									error: (error) => `Failed to save settings: ${error}`,
								},
							);
						}}
					>
						set active
					</Button>
				)}
				<ConfirmButton
					title="Leave Organization"
					description="Are you sure you want to leave this organization? You will lose access to all resources and data associated with it."
					onConfirm={() => {
						toast.promise(
							authClient.organization.leave({
								organizationId: id,
							}),
							{
								loading: "Leaving organization...",
								success: () => {
									window.location.reload();
									return "Successfully left organization";
								},
								error: (error) => `Failed to leave organization: ${error}`,
							},
						);
					}}
				>
					leave
				</ConfirmButton>
				<ConfirmButton
					title="Delete Organization"
					description="Are you sure you want to delete this organization? This action cannot be undone."
					onConfirm={() => {
						toast.promise(
							authClient.organization.delete({
								organizationId: id,
							}),
							{
								loading: "Deleting organization...",
								success: () => {
									window.location.reload();
									return "Organization deleted successfully";
								},
								error: (error) => `Failed to delete organization: ${error}`,
							},
						);
					}}
				>
					delete
				</ConfirmButton>
				<GenerateInvitationCodeButton organizationId={id} />
				<RevokeInvitationCodeButton organizationId={id} />
			</div>
			<div className="flex flex-row gap-2">
				<Input
					placeholder="Invite member by email"
					value={inviteMail}
					onChange={(e) => setInviteMail(e.target.value)}
				/>
				<Button
					onClick={async () => {
						toast.promise(
							authClient.organization.inviteMember({
								organizationId: id,
								email: inviteMail,
								role: "member",
							}),
							{
								loading: "Inviting member...",
								success: () => {
									setInviteMail("");
									return "Member invited successfully";
								},
								error: (error) => `Failed to invite member: ${error}`,
							},
						);
					}}
				>
					invite
				</Button>
			</div>
		</li>
	);
}

function OrganizationCreateForm() {
	const [state, formAction, pending] = useActionState(
		CreateOrganizationAction,
		{},
	);

	useEffect(() => {
		if (state?.error) {
			toast.error(state.error);
		}
		if (state?.redirect) {
			window.location.reload();
		}
	}, [state]);

	return (
		<form action={formAction} className="flex flex-col gap-2">
			<Label
				className="mb-auto text-base font-bold flex-1 my-auto"
				htmlFor="name"
			>
				Create Organization
			</Label>
			<div className="flex flex-row gap-2">
				<Input
					placeholder="Enter Organization Name"
					id="name"
					name="name"
					defaultValue={""}
				/>
				<Button type="submit" disabled={pending}>
					Create
				</Button>
			</div>
		</form>
	);
}

function GenerateInvitationCodeButton({
	organizationId,
}: {
	organizationId: string;
}) {
	const [state, formAction, pending] = useActionState(
		GenerateInvitationCodeAction,
		{},
	);

	useEffect(() => {
		if (state?.error) {
			toast.error(state.error);
		}
		if (state?.code) {
			toast.success(`Invitation code copied to clipboard!`);
			//click to copy
			navigator.clipboard.writeText(
				`${process.env.NEXT_PUBLIC_FRONTEND_URL}/account?invitation=${state.code}`,
			);
		}
	}, [state]);

	return (
		<form action={formAction} className="flex flex-row gap-2">
			<input type="hidden" name="organizationId" value={organizationId} />
			<Button type="submit" disabled={pending}>
				{pending && <Loader className="animate-spin" />}
				Generate Invitation Code
			</Button>
		</form>
	);
}

function RevokeInvitationCodeButton({
	organizationId,
}: {
	organizationId: string;
}) {
	const [state, formAction, pending] = useActionState(
		RevokeInvitationCodeAction,
		{},
	);

	useEffect(() => {
		if (state?.error) {
			toast.error(state.error);
		}
	}, [state]);

	return (
		<form action={formAction} className="flex flex-row gap-2">
			<input type="hidden" name="organizationId" value={organizationId} />
			<Button type="submit" disabled={pending}>
				{pending && <Loader className="animate-spin" />}
				Revoke Invitation Code
			</Button>
		</form>
	);
}
