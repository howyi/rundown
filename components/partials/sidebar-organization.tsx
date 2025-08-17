"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function SidebarOrganization() {
	const { data: activeOrganization } = authClient.useActiveOrganization();

	if (!activeOrganization) {
		return null;
	}
	return (
		<div className=" bg-green-800 text-green-300 text-xs p-1">
			<p>
				organization :{" "}
				<Link href={`/account`} className="underline">
					{activeOrganization?.name}
				</Link>
			</p>
		</div>
	);
}
