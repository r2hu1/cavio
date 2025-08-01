import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const googleai = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});
