import { SYSTEM_PROMPT } from "@/modules/ai/constants";
import type { AIProvider } from "@/modules/ai/types";
import {
	getApiKey,
	getChatModel,
	getProvider,
} from "@/modules/ai/views/creds/lib";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, streamText } from "ai";
import { NextResponse } from "next/server";

function createProvider(provider: AIProvider, apiKey: string) {
	switch (provider) {
		case "gemini":
			return createGoogleGenerativeAI({ apiKey });
		case "openrouter":
			return createOpenRouter({ apiKey });
		case "groq":
			return createOpenAI({
				apiKey,
				baseURL: "https://api.groq.com/openai/v1",
			});
		default:
			throw new Error(`Unknown provider: ${provider}`);
	}
}

function getModelId(provider: AIProvider, model: string) {
	switch (provider) {
		case "gemini":
			return `models/${model}`;
		case "openrouter":
		case "groq":
			return model;
		default:
			return model;
	}
}

export async function POST(req: Request) {
	const { messages, id, trigger } = await req.json();
	if (!messages || messages.length === 0) {
		return NextResponse.json({ status: 200 });
	}

	const provider = await getProvider();
	const key = await getApiKey(provider);
	const model = await getChatModel();

	if (!key) {
		return NextResponse.json(
			{
				text: "No API key found, please set it in the ![settings](/settings/preferences).",
			},
			{ status: 200 },
		);
	}

	try {
		const aiProvider = createProvider(provider, key);
		const modelId = getModelId(provider, model);

		const completion = streamText({
			model: aiProvider(modelId) as any,
			prompt: await convertToModelMessages(messages),
			system: SYSTEM_PROMPT,
		});

		return completion.toUIMessageStreamResponse();
	} catch (error: any) {
		console.error("Chat error:", error);
		return NextResponse.json(
			{
				text: `Error: ${error.message}`,
			},
			{ status: 200 },
		);
	}
}
