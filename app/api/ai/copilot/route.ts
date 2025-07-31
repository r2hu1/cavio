import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// export const runtime = "edge";

const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  const { prompt: messages } = await req.json();
  if (!messages || messages.length === 0) {
    return NextResponse.json(
      {
        completion: "0",
      },
      { status: 200 },
    );
  }

  const completion = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: messages,
    config: {
      systemInstruction: `You are an advanced AI writing assistant, similar to VSCode Copilot but for general text. Your task is to predict and generate the next part of the text based on the given context.

    Rules:
      - Continue the text naturally up to the next punctuation mark (., ,, ;, :, ?, or !).
      - Maintain style and tone. Don't repeat given text.
      - For unclear context, provide the most likely continuation.
      - Handle code snippets, lists, or structured text if needed.
      - Don't include """ in your response.
      - CRITICAL: Always end with a punctuation mark.
      - CRITICAL: Avoid starting a new block. Do not use block formatting like >, #, 1., 2., -, etc. The suggestion should continue in the same block as the context.
      - If no context is provided or you can't generate a continuation, return "0" without explanation.`,
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  });

  // console.log(completion);
  return NextResponse.json(
    {
      text: completion?.candidates?.[0]?.content?.parts?.[0]?.text,
    },
    { status: 200 },
  );
}
