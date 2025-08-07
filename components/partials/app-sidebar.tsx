import Link from "next/link";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { FeedList } from "../shared/feed-list";
import { Button } from "../ui/button";
import { SignOutButton } from "./sign-out-button";

export async function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<Button asChild>
					<Link href="/timeline">Timeline</Link>
				</Button>
			</SidebarHeader>
			<SidebarContent>
				<FeedList />
			</SidebarContent>
			<SidebarFooter>
				<Button asChild>
					<Link href="/feeds">Feed List</Link>
				</Button>
				<Button asChild>
					<Link href="/settings">Settings</Link>
				</Button>
				<SignOutButton />
			</SidebarFooter>
		</Sidebar>
	);
}
