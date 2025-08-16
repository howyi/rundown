"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export function AuthForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [formType, setFormType] = React.useState<"sign-in" | "sign-up">(
		"sign-in",
	);
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	async function onSubmit(event: React.SyntheticEvent) {
		event.preventDefault();
		setIsLoading(true);

		if (formType === "sign-up") {
			try {
				await authClient.signUp.email(
					{
						email,
						password,
						name: email.split("@")[0],
					},
					{
						onRequest: () => {
							setIsLoading(true);
						},
						onSuccess: () => {
							router.push("/settings/summarize");
						},
						onError: (ctx) => {
							toast.error(ctx.error.message);
						},
					},
				);
			} finally {
				setIsLoading(false);
			}
		} else {
			try {
				await authClient.signIn.email(
					{
						email,
						password,
					},
					{
						onRequest: () => {
							setIsLoading(true);
						},
						onSuccess: () => {
							router.push("/timeline");
						},
						onError: (ctx) => {
							toast.error(ctx.error.message);
						},
					},
				);
			} finally {
				setIsLoading(false);
			}
		}
	}

	return (
		<div className={"w-full max-w-md p-4"}>
			<div className="text-center text-3xl font-bold pb-12">
				<Link href="/">📡 rundown</Link>
			</div>
			<form onSubmit={onSubmit} className="flex flex-col gap-2">
				{/** biome-ignore lint/suspicious/noExplicitAny: value is string */}
				<Tabs value={formType} onValueChange={(v) => setFormType(v as any)}>
					<TabsList className="w-full gap-2">
						<TabsTrigger value="sign-in">Sign In</TabsTrigger>
						<TabsTrigger value="sign-up">Sign Up</TabsTrigger>
					</TabsList>
				</Tabs>
				<div>
					<Label className="sr-only" htmlFor="email">
						Email
					</Label>
					<Input
						id="email"
						placeholder="name@example.com"
						type="email"
						autoCapitalize="none"
						autoComplete="email"
						autoCorrect="off"
						disabled={isLoading}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div>
					<Label className="sr-only" htmlFor="password">
						Password
					</Label>
					<Input
						id="password"
						placeholder="Enter your password"
						type="password"
						autoCapitalize="none"
						autoComplete={
							formType === "sign-in" ? "current-password" : "new-password"
						}
						disabled={isLoading}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<Button disabled={isLoading}>
					{isLoading ? (
						<LoaderCircle className="animate-spin" />
					) : formType === "sign-in" ? (
						"Sign In with Email"
					) : (
						"Sign Up with Email"
					)}
				</Button>
				<div className="text-xs text-muted-foreground text-center mt-4">
					By creating an account, you agree to the
					<br />
					<Link href="/terms" className="underline" target="_blank">
						Terms of Service
					</Link>{" "}
					and{" "}
					<Link href="/privacy" className="underline" target="_blank">
						Privacy Policy
					</Link>
					.
				</div>
			</form>
		</div>
	);
}
