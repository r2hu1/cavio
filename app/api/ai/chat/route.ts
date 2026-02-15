import { SYSTEM_PROMPT } from "@/modules/ai/constants";
import { createProvider, getModelId } from "@/modules/ai/server/utils";
import {
	getApiKey,
	getChatModel,
	getProvider,
} from "@/modules/ai/views/creds/lib";
import { convertToModelMessages, streamText } from "ai";
import { NextResponse } from "next/server";

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

		const memory = `
      <Memory>
        <DocumentName>${messages[messages?.length - 1]?.metadata?.document_title}</DocumentName>
        <LastEditedContent>${messages[messages?.length - 1]?.metadata?.document_last_edited}</LastEditedContent>
      </Memory>
    `;
		const completion = streamText({
			model: aiProvider(modelId) as any,
			prompt: await convertToModelMessages(messages),
			system: SYSTEM_PROMPT + memory,
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
