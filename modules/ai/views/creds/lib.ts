"use server";
import "dotenv/config";

import { cookies } from "next/headers";
import { headers } from "next/headers";
import { AIProvider, ModelId } from "@/modules/ai/types";
import { db } from "@/db/client";
import { apiKeys } from "@/db/schema";
import { encrypt, decrypt } from "@/lib/encryption";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

async function getCurrentUser() {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs });
  return session?.user;
}

async function getOrCreateApiKeysRecord(userId: string) {
  const records = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.userId, userId))
    .limit(1);

  let record = records[0];

  if (!record) {
    const [newRecord] = await db
      .insert(apiKeys)
      .values({
        userId,
        gemini: "",
        groq: "",
        openrouter: "",
      })
      .returning();
    record = newRecord;
  }

  return record;
}

export async function setProvider(value: AIProvider) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const record = await getOrCreateApiKeysRecord(user.id);

  await db
    .update(apiKeys)
    .set({
      active_provider: value,
      updatedAt: new Date(),
    })
    .where(eq(apiKeys.id, record.id));
}

export async function getProvider(): Promise<AIProvider> {
  const user = await getCurrentUser();
  if (!user) {
    return "gemini";
  }

  const records = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.userId, user.id))
    .limit(1);

  return (records[0]?.active_provider as AIProvider) || "gemini";
}

export async function setApiKey(provider: AIProvider, value: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const record = await getOrCreateApiKeysRecord(user.id);

  const encryptedValue = value ? encrypt(value) : "";

  await db
    .update(apiKeys)
    .set({
      [provider]: encryptedValue,
      updatedAt: new Date(),
    })
    .where(eq(apiKeys.id, record.id));

  const cookieStore = await cookies();
  cookieStore.set(`apiKey_${provider}`, value, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getApiKey(provider?: AIProvider) {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const currentProvider = provider || (await getProvider());

  const records = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.userId, user.id))
    .limit(1);

  const record = records[0];

  if (!record || !record[currentProvider]) {
    return null;
  }

  try {
    return decrypt(record[currentProvider]);
  } catch {
    return null;
  }
}

export async function getAllApiKeys(): Promise<Record<AIProvider, string>> {
  const user = await getCurrentUser();
  if (!user) {
    return { gemini: "", openrouter: "", groq: "" };
  }

  const records = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.userId, user.id))
    .limit(1);

  const record = records[0];

  if (!record) {
    return { gemini: "", openrouter: "", groq: "" };
  }

  const keys: Record<AIProvider, string> = {
    gemini: "",
    openrouter: "",
    groq: "",
  };

  for (const provider of ["gemini", "openrouter", "groq"] as AIProvider[]) {
    if (record[provider]) {
      try {
        keys[provider] = decrypt(record[provider]);
      } catch {
        keys[provider] = "";
      }
    }
  }

  return keys;
}

export async function setLegacyApiKey(value: string) {
  const cookieStore = await cookies();
  cookieStore.set("apiKey", value, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getLegacyApiKey() {
  const cookieStore = await cookies();
  return cookieStore.get("apiKey")?.value || null;
}

export async function setChatModel(value: ModelId) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const record = await getOrCreateApiKeysRecord(user.id);

  await db
    .update(apiKeys)
    .set({
      chat_model: value,
      updatedAt: new Date(),
    })
    .where(eq(apiKeys.id, record.id));
}

export async function getChatModel(): Promise<ModelId> {
  const user = await getCurrentUser();
  if (!user) {
    return "gemini-2.5-flash";
  }

  const records = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.userId, user.id))
    .limit(1);

  return (records[0]?.chat_model as ModelId) || "gemini-2.5-flash";
}

export async function setCommandModel(value: ModelId) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const record = await getOrCreateApiKeysRecord(user.id);

  await db
    .update(apiKeys)
    .set({
      copilot_model: value,
      updatedAt: new Date(),
    })
    .where(eq(apiKeys.id, record.id));
}

export async function getCommandModel(): Promise<ModelId> {
  const user = await getCurrentUser();
  if (!user) {
    return "gemini-2.5-flash";
  }

  const records = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.userId, user.id))
    .limit(1);

  return (records[0]?.copilot_model as ModelId) || "gemini-2.5-flash";
}
