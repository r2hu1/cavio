import { Session, User } from "better-auth";
import { auth } from "../auth";
import { headers } from "next/headers";

const authCache = new Map<string, { session: Session; user: User }>();

export const isAuthenticated = async () => {
	const cached = authCache.get("auth");

	if (cached?.session?.expiresAt) {
		const expiryDate = new Date(cached.session.expiresAt);
		if (expiryDate > new Date()) {
			return {
				session: cached.session,
				user: cached.user,
			};
		}
	}

	const sess = await auth.api.getSession({
		headers: await headers(),
	});

	if (sess?.session && sess?.user) {
		authCache.set("auth", {
			session: sess.session,
			user: sess.user,
		});

		return {
			session: sess.session,
			user: sess.user,
		};
	}

	return null;
};
