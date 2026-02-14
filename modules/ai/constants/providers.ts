import type { AIProvider } from "@/modules/ai/types";

export const PROVIDER_CONFIG: Record<
	AIProvider,
	{ name: string; description: string; placeholder: string; baseUrl?: string }
> = {
	gemini: {
		name: "Google Gemini",
		description: "Google's Gemini AI models",
		placeholder: "AIza................",
	},
	openrouter: {
		name: "OpenRouter",
		description: "Access multiple AI models through OpenRouter",
		placeholder: "sk-or-v1-...",
		baseUrl: "https://openrouter.ai/api/v1",
	},
	groq: {
		name: "Groq",
		description: "Fast inference with Groq",
		placeholder: "gsk_...",
		baseUrl: "https://api.groq.com/openai/v1",
	},
};
