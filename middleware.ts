import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { signOut } from "./lib/auth-client";

export async function middleware(request: NextRequest) {
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
		try {
			await signOut();
		} catch {
			// maybe loging error here
		}
		return NextResponse.redirect(new URL("/home", request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/",
		"/pro",
		"/account",
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
