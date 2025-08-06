import Link from "next/link";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { SignOutButton } from "./sign-out-button";

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<Button asChild>
					<Link href="/feeds">feeds</Link>
				</Button>
			</SidebarHeader>
			<SidebarContent></SidebarContent>
			<SidebarFooter>
				<Button asChild>
					<Link href="/settings">Settings</Link>
				</Button>
				<SignOutButton />
			</SidebarFooter>
		</Sidebar>
	);
}
