import { AppSidebar } from "@/components/partials/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<div className="flex flex-col gap-2 w-full max-w-5xl mx-auto p-4">
				<main>{children}</main>
			</div>
		</SidebarProvider>
	);
}
