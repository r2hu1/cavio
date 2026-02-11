import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const sessionDeProtectedRoutes = ["/auth/sign-in", "/auth/sign-up"];
  if (
    sessionCookie &&
    sessionDeProtectedRoutes.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (
    !sessionCookie &&
    !sessionDeProtectedRoutes.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/pro",
    "/settings",
    "/settings/account",
    "/settings/preferences",
    "/settings/billing",
    "/settings/danger",
    "/auth/sign-up",
    "/auth/sign-in",
    "/folder/:folderId",
    "/folder/:folderId/:id",
    "/api/ai",
    "/api/ai/copilot",
    "/api/ai/command",
    "/api/ai/chat",
  ],
};
