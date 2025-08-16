import { Heart, Home, Rss, Settings2 } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { ListUserFeed } from "@/server/queries/list-user-feed";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { SidebarFoldButton } from "./sidebar-fold-button";
import { SignOutButton } from "./sign-out-button";

export async function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader className="flex flex-col">
				{process.env.NEXT_PUBLIC_LIVE_DEMO && (
					<>
						<Button
							asChild
							className="border-[#C96198] text-[#C96198] hover:bg-[#C96198]/40 hover:text-foreground"
						>
							<a
								href="https://github.com/sponsors/howyi"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Heart />
								Support this project
							</a>
						</Button>
						<Separator />
					</>
				)}
				<div className="flex-1 flex flex-row gap-2">
					<SidebarFoldButton />
					<Button asChild className="flex-1" size={"sm"}>
						<Link href="/timeline">
							<Home />
							Timeline
						</Link>
					</Button>
				</div>
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

	return (
		<SidebarMenu>
			{feeds.map((feed) => (
				<SidebarMenuItem key={feed.id} className="px-2 truncate">
					<SidebarMenuButton asChild>
						<Link href={`/feeds/${feed.id}`}>{feed.title}</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
			<div
				className={cn(
					"p-2 text-xs text-muted-foreground mx-auto hover:underline",
					feeds.length === 0 && "animate-pulse text-foreground font-bold",
				)}
			>
				<Link href="/feeds">+ Add RSS URL</Link>
			</div>
		</SidebarMenu>
	);
}
