import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { AIProvider } from "../types";

export function createProvider(provider: AIProvider, apiKey: string) {
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

export function getModelId(provider: AIProvider, model: string) {
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
