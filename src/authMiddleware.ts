import { validateSessionToken } from "./pages/api/authenticate.ts";
import type { Session, User } from "./pages/api/authenticate.ts";
import {
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from "./pages/api/authenticate.ts";
import { defineMiddleware } from "astro:middleware";

// fix module augmentation error
declare global {
	namespace App {
		interface Locals {
			user: User | null;
			session: Session | null;
		}
	}
}

/**
 * onRequest is a middleware that runs on every request
 * and checks if the user is authenticated by validating the session token
 */
export const onRequest = defineMiddleware(async (context, next) => {
	const token = context.cookies.get("session")?.value ?? null;

	if (!token) {
		context.locals.user = null;
		context.locals.session = null;
		return next();
	}

	const { session, user } = await validateSessionToken(token);

	if (session !== null) {
		setSessionTokenCookie(context, token, session.expiresAt);
	} else {
		deleteSessionTokenCookie(context);
	}

	context.locals.session = session;
	context.locals.user = user;

	return next();
});
