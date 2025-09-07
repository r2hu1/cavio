"use server";

import { cookies } from "next/headers";

export async function setApiKey(value: string) {
  const cookieStore = await cookies();
  cookieStore.set("apiKey", value, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getApiKey() {
  const cookieStore = await cookies();
  return cookieStore.get("apiKey")?.value || null;
}
