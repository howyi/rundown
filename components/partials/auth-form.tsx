"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AuthForm({ className, ...props }: AuthFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [isLogin, setIsLogin] = React.useState<boolean>(true);
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	async function onSubmit(event: React.SyntheticEvent) {
		event.preventDefault();
		setIsLoading(true);

		if (!isLogin) {
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
							router.push("/");
						},
						onError: (ctx) => {
							alert(ctx.error.message);
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
							router.push("/");
						},
						onError: (ctx) => {
							alert(ctx.error.message);
						},
					},
				);
			} finally {
				setIsLoading(false);
			}
		}
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			<div className="flex justify-center">
				<button
					type="button"
					className="text-sm underline underline-offset-4 hover:text-primary"
					onClick={() => setIsLogin(!isLogin)}
				>
					{isLogin
						? "Need an account? Sign up"
						: "Already have an account? Sign in"}
				</button>
			</div>
			<form onSubmit={onSubmit}>
				<div className="grid gap-2">
					<div className="grid gap-1">
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
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="password">
							Password
						</Label>
						<Input
							id="password"
							placeholder="Enter your password"
							type="password"
							autoCapitalize="none"
							autoComplete={isLogin ? "current-password" : "new-password"}
							disabled={isLoading}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<Button disabled={isLoading}>
						{isLoading && "loading..."}
						{isLogin ? "Sign In with Email" : "Sign Up with Email"}
					</Button>
				</div>
			</form>
		</div>
	);
}
