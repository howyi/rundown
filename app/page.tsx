import { headers } from "next/headers";
import Link from "next/link";
import { ProductDescription } from "@/components/partials/product-description";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { RandomPick } from "@/lib/random-pick";

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<>
			<Background />
			<main className="mx-auto p-4 pt-24 flex flex-col gap-[32px] row-start-2 items-center md:my-12 max-w-4xl backdrop-blur-xs bg-background/40 md:border">
				<h1 className="text-4xl font-bold animate-pulse">📡 </h1>
				<h1 className="text-4xl font-bold ">rundown</h1>
				<Button asChild>
					{session ? (
						<Link href="/timeline">Go to Timeline</Link>
					) : (
						<Link href="/sign-in" className="text-sm">
							Sign in
						</Link>
					)}
				</Button>
				<p className="text-lg font-black">
					AI-powered RSS reader that helps you read less and learn more
				</p>
				<ProductDescription />
			</main>
		</>
	);
}

function Background() {
	const bgImages = [
		"bg-[url(/bg-1.jpg)]",
		"bg-[url(/bg-2.jpg)]",
		"bg-[url(/bg-3.jpg)]",
		"bg-[url(/bg-4.jpg)]",
		"bg-[url(/bg-5.jpg)]",
	];
	const randomImage = RandomPick(bgImages);

	return (
		<div
			className={cn(
				"fixed inset-0 w-full h-full bg-cover from-background to-transparent -z-10",
				randomImage,
			)}
		/>
	);
}
