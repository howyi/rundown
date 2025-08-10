"use client";

import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

export function SidebarFoldButton() {
	const { toggleSidebar } = useSidebar();
	return (
		<Button size={"sm"} variant={"outline"} onClick={toggleSidebar}>
			<PanelLeft />
		</Button>
	);
}

export function SidebarOpenButton({ className }: { className?: string }) {
	const { toggleSidebar, open } = useSidebar();
	return (
		<Button
			className={cn("my-auto", open ? "block md:hidden" : "block", className)}
			size={"sm"}
			variant={"outline"}
			onClick={toggleSidebar}
		>
			<PanelLeft />
		</Button>
	);
}
