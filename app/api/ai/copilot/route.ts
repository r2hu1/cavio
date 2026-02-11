import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { getApiKey } from "@/modules/ai/views/creds/lib";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { prompt: messages } = await req.json();
  if (!messages || messages.length === 0) {
    return NextResponse.json({ status: 200 });
  }
  const key = await getApiKey();
  if (!key) {
    return NextResponse.json(
      {
        text: "No API key found, please set it in the [settings](/settings/preferences).",
      },
      { status: 200 },
    );
  }
  console.log(key);

  try {
    const googleai = createGoogleGenerativeAI({
      apiKey: key || "",
    });

    const completion = await generateText({
      model: googleai.languageModel("models/gemini-5.0-flash") as any,
      prompt: messages,
      system: `You are an advanced AI writing assistant, similar to VSCode Copilot but for general text. Your task is to predict and generate the next part of the text based on the given context.

      Rules:
        - Continue the text naturally up to the next punctuation mark (., ,, ;, :, ?," " or !).
        - Maintain style and tone. Don't repeat given text.
        - For unclear context, provide the most likely continuation.
        - Handle code snippets, lists, or structured text if needed.
        - Don't include """ in your response.
        - CRITICAL: Always end with a punctuation mark.
        - CRITICAL: Avoid starting a new block. Do not use block formatting like >, #, 1., 2., -, etc. The suggestion should continue in the same block as the context.
        - If no context is provided or you can't generate a continuation, return "" without explanation.
        - CRITICAL: Don't return any information about yourself or your capabilities.
        `,
    });

    return NextResponse.json(
      {
        text: completion.text,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        text: "",
        error: error.message,
      },
      { status: 200 },
    );
  }
}
