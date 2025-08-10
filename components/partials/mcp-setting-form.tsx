"use client";

import { Clipboard, LoaderCircle, RefreshCw, Trash } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
	RegenerateApiKeyAction,
	RevokeApiKeyAction,
} from "@/server/controllers/actions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function McpSettingForm({ mcpApiKey }: { mcpApiKey: string }) {
	return (
		<div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden break-words whitespace-pre-wrap">
			<McpApiKeyForm mcpApiKey={mcpApiKey} />
		</div>
	);
}

function McpApiKeyForm({ mcpApiKey }: { mcpApiKey: string }) {
	return (
		<div className="flex flex-col gap-2">
			<Label className="mb-auto font-bold flex-1 my-auto" htmlFor="url">
				MCP API Key
			</Label>
			<div className="flex flex-row gap-2">
				<Input
					value={mcpApiKey}
					disabled
					placeholder="Click 'Regenerate API Key' button to generate an API key"
				/>
				<Button
					className="font-bold"
					type="button"
					variant={"outline"}
					onClick={() => navigator.clipboard.writeText(mcpApiKey)}
				>
					<Clipboard />
				</Button>
			</div>
			<div className="flex flex-row gap-2">
				<RegenerateApiKeyButton />
				<RevokeApiKeyButton />
			</div>
		</div>
	);
}

function RegenerateApiKeyButton() {
	const [state, formAction, pending] = useActionState(
		RegenerateApiKeyAction,
		{},
	);

	useEffect(() => {
		if (state?.error) {
			toast.error(state.error);
		}
	}, [state]);

	return (
		<form action={formAction} className="flex flex-row gap-2">
			<Button type="submit" size="sm" disabled={pending}>
				{pending ? <RefreshCw className="animate-spin" /> : <RefreshCw />}
				Regenerate API Key
			</Button>
		</form>
	);
}

function RevokeApiKeyButton() {
	const [state, formAction, pending] = useActionState(RevokeApiKeyAction, {});

	useEffect(() => {
		if (state?.error) {
			toast.error(state.error);
		}
	}, [state]);

	return (
		<form action={formAction} className="flex flex-row gap-2">
			<Button type="submit" size="sm" disabled={pending}>
				{pending ? <LoaderCircle className="animate-spin" /> : <Trash />}
				Revoke API Key
			</Button>
		</form>
	);
}
