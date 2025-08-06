import { headers } from "next/headers";
import { AuthForm } from "@/components/partials/auth-form";
import { auth } from "@/lib/auth";

export default async function Home() {
	const _session = await auth.api.getSession({
		headers: await headers(),
	});
	return (
		<div className="font-sans items-center justify-items-center min-h-screen p-80">
			<AuthForm />
		</div>
	);
}
