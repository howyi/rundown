import { Home, Rss, Settings2 } from "lucide-react";
import Link from "next/link";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getUserId } from "@/lib/auth";
import { ListUserFeed } from "@/server/queries/list-user-feed";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { SidebarFoldButton } from "./sidebar-fold-button";
import { SignOutButton } from "./sign-out-button";

export async function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader className="flex flex-row">
				<SidebarFoldButton />
				<Button asChild className="flex-1" size={"sm"}>
					<Link href="/timeline">
						<Home />
						Timeline
					</Link>
				</Button>
			</SidebarHeader>
			<SidebarContent>
				<FeedItems />
			</SidebarContent>
			<SidebarFooter>
				<div className="flex flex-row gap-1">
					<SignOutButton />
					<Tooltip>
						<TooltipTrigger asChild>
							<Button size={"sm"} asChild>
								<Link href="/settings">
									<Settings2 />
								</Link>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Settings</p>
						</TooltipContent>
					</Tooltip>
					<Button size={"sm"} asChild className="flex-1">
						<Link href="/feeds">
							<Rss />
							Feed List
						</Link>
					</Button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}

async function FeedItems() {
	const userId = await getUserId();

	const feeds = await ListUserFeed({ userId });

	if (feeds.length === 0) {
		return <div>No feeds available</div>;
	}

	return (
		<SidebarMenu>
			{feeds.map((feed) => (
				<SidebarMenuItem key={feed.id} className="px-2">
					<SidebarMenuButton asChild>
						<Link href={`/feeds/${feed.id}`}>{feed.title}</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
			<div className="p-2 text-xs text-muted-foreground mx-auto hover:underline">
				<Link href="/feeds">+ Add RSS URL</Link>
			</div>
		</SidebarMenu>
	);
}
