import { AuthForm } from "@/components/partials/auth-form";

export default async function Home() {
	return (
		<div className="flex items-center justify-center min-h-dvh">
			<AuthForm />
		</div>
	);
}
