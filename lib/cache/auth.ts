import { Session, User } from "better-auth";
import { auth } from "../auth";
import { headers } from "next/headers";
import { TTLCache } from "./ttl";

const authCache = new TTLCache<string, { session: Session; user: User }>(
	5 * 60 * 1000,
);

export const isAuthenticated = async () => {
	const hdrs = await headers();
	const key = hdrs.get("authorization") ?? "auth";

	const cached = authCache.get(key);
	if (cached?.session?.expiresAt) {
		const expiryDate = new Date(cached.session.expiresAt);
		if (expiryDate > new Date()) {
			return cached;
		}
	}

	const sess = await auth.api.getSession({ headers: hdrs });

	if (sess?.session && sess?.user) {
		authCache.set(key, {
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
