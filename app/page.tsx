import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductDescription } from "@/components/partials/product-description";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session) {
		redirect("/timeline");
	}

	return (
		<main className="mx-auto p-4 pt-24 flex flex-col gap-[32px] row-start-2 items-center my-auto max-w-4xl">
			<h1 className="text-4xl font-bold animate-pulse">📡 </h1>
			<h1 className="text-4xl font-bold ">rundown</h1>
			<Button asChild>
				<Link href="/sign-in" className="text-sm">
					Sign in
				</Link>
			</Button>
			<p className="text-lg font-black">
				AI-powered RSS reader that helps you read less and learn more
			</p>
			<ProductDescription />
		</main>
	);
}
