import { AppSidebar } from "@/components/partials/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<div className="flex flex-col gap-2 w-full max-w-5xl mx-auto p-4">
				<div>
					<SidebarTrigger />
				</div>
				<main>{children}</main>
			</div>
		</SidebarProvider>
	);
}
