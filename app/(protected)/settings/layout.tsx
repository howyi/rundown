import { SettingsHeader } from "@/components/shared/header";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<SettingsHeader title="Settings" />
			{children}
		</>
	);
}
