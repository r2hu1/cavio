import { SYSTEM_PROMPT } from "@/modules/ai/constants";
import { createProvider, getModelId } from "@/modules/ai/server/utils";
import {
	getApiKey,
	getChatModel,
	getProvider,
} from "@/modules/ai/views/creds/lib";
import { convertToModelMessages, streamText, tool } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

interface SearchResult {
	title: string;
	snippet?: string;
	answer?: string;
	link?: string;
}

async function performWebSearch(query: string): Promise<string> {
	const apiKey = process.env.SERPAPI_KEY;

	if (!apiKey) {
		return "Web search is not configured. Please set the SERPAPI_KEY environment variable.";
	}

	try {
		const params = new URLSearchParams({
			q: query,
			api_key: apiKey,
			engine: "google",
			num: "5",
		});

		const response = await fetch(
			`https://serpapi.com/search.json?${params.toString()}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		if (!response.ok) {
			return `Search failed: ${response.statusText}`;
		}

		const data = await response.json();
		const results: SearchResult[] =
			data.organic_results || data.answer_box || [];

		if (results.length === 0) {
			return "No results found for the search query.";
		}

		return results
			.slice(0, 5)
			.map((result, index) => {
				return `${index + 1}. ${result.title}\n${result.snippet || result.answer}\n${result.link || ""}`;
			})
			.join("\n\n");
	} catch (error) {
		console.error("Web search error:", error);
		return "Failed to perform web search. Please try again.";
	}
}

export async function POST(req: Request) {
	const { messages } = await req.json();
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
		const lastMessage = messages[messages?.length - 1];
		const webSearchEnabled = lastMessage?.metadata?.web_search_enabled;

		const memory = `
      <Memory>
        <DocumentName>${lastMessage?.metadata?.document_title}</DocumentName>
        <LastEditedContent>${lastMessage?.metadata?.document_last_edited}</LastEditedContent>
      </Memory>
    `;

		const webSearchTool = webSearchEnabled
			? tool({
					description:
						"Search the web for current information, news, or facts. Use this when the user asks about recent events, current data, or anything that requires up-to-date information.",
					inputSchema: z.object({
						query: z
							.string()
							.describe("The search query to look up on the web"),
					}),
					execute: async ({ query }: { query: string }) => {
						return performWebSearch(query);
					},
				})
			: undefined;

		const completion = streamText({
			model: aiProvider(modelId),
			prompt: await convertToModelMessages(messages),
			system: SYSTEM_PROMPT + memory,
			...(webSearchTool ? { tools: { web_search: webSearchTool } } : {}),
		});

		return completion.toUIMessageStreamResponse();
	} catch (error) {
		console.error("Chat error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		return NextResponse.json(
			{
				text: `Error: ${errorMessage}`,
			},
			{ status: 200 },
		);
	}
}
