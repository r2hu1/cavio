import type { AIProvider } from "@/modules/ai/types";
import { getApiKey, getProvider } from "@/modules/ai/views/creds/lib";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const providerParam = searchParams.get("provider") as AIProvider | null;

	const provider = providerParam || (await getProvider());
	const apiKey = await getApiKey(provider);

	if (!apiKey) {
		return NextResponse.json({ error: "No API key found" }, { status: 401 });
	}

	try {
		let models: any[] = [];

		switch (provider) {
			case "gemini":
				models = await fetchGeminiModels(apiKey);
				break;
			case "openrouter":
				models = await fetchOpenRouterModels(apiKey);
				break;
			case "groq":
				models = await fetchGroqModels(apiKey);
				break;
			default:
				return NextResponse.json(
					{ error: "Unknown provider" },
					{ status: 400 },
				);
		}

		return NextResponse.json({ models });
	} catch (error: any) {
		console.error("Error fetching models:", error);
		return NextResponse.json(
			{ error: error.message || "Failed to fetch models" },
			{ status: 500 },
		);
	}
}

async function fetchGeminiModels(apiKey: string) {
	const response = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=100`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);

	if (!response.ok) {
		throw new Error(`Failed to fetch models: ${response.statusText}`);
	}

	const data = await response.json();

	return (
		data.models
			?.filter(
				(model: any) =>
					model.name.startsWith("models/gemini") &&
					model.supportedGenerationMethods?.includes("generateContent"),
			)
			?.map((model: any) => {
				const id = model.name.replace("models/", "");
				const label = id
					.replace(/-/g, " ")
					.replace(/\b\w/g, (l: string) => l.toUpperCase())
					.replace(/gemini/i, "Gemini")
					.replace(/flash/i, "Flash")
					.replace(/pro/i, "Pro")
					.replace(/lite/i, "Lite");

				return {
					value: id,
					label: label,
					description: model.description,
					version: model.version,
				};
			})
			?.sort((a: any, b: any) => {
				const versionA = Number.parseFloat(a.version) || 0;
				const versionB = Number.parseFloat(b.version) || 0;
				if (versionB !== versionA) return versionB - versionA;
				return a.label.localeCompare(b.label);
			}) || []
	);
}

async function fetchOpenRouterModels(apiKey: string) {
	const response = await fetch("https://openrouter.ai/api/v1/models", {
		method: "GET",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch models: ${response.statusText}`);
	}

	const data = await response.json();

	return (
		data.data
			?.map((model: any) => ({
				value: model.id,
				label: model.name || model.id,
				description: model.description,
				version: model.version,
			}))
			?.sort((a: any, b: any) => a.label.localeCompare(b.label)) || []
	);
}

async function fetchGroqModels(apiKey: string) {
	const response = await fetch("https://api.groq.com/openai/v1/models", {
		method: "GET",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch models: ${response.statusText}`);
	}

	const data = await response.json();

	return (
		data.data
			?.filter(
				(model: any) =>
					// Only include chat completion models
					model.object === "model" &&
					!model.id.includes("whisper") &&
					!model.id.includes("tts"),
			)
			?.map((model: any) => ({
				value: model.id,
				label: model.id
					.replace(/-/g, " ")
					.replace(/\b\w/g, (l: string) => l.toUpperCase()),
				description: `Owned by ${model.owned_by}`,
				version: model.created?.toString(),
			}))
			?.sort((a: any, b: any) => a.label.localeCompare(b.label)) || []
	);
}
