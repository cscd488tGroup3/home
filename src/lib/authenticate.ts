// import { Handler } from '@netlify/functions'
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { APIContext } from "astro";

const USR_SESSION = import.meta.env.USR_SESSION;

/**
 * generateSessionToken generates a random session token
 * @returns token representing the session token
 */
export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

/**
 * createSession creates a session in the database
 * @param token 
 * @param userId 
 * @returns session object representing the session
 */
export async function createSession(token: string, userId: number): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/sessions/new?usid=${session.id}&uid=${session.userId}&expires_at=${session.expiresAt}&sauth=${USR_SESSION}`);
	return session;
}

/**
 * validateSessionToken validates a session token by checking if it exists in the database
 * @param token the session token to validate
 * @returns the session and user if valid, null otherwise
 * @throws Error if the request fails
 */
export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const row = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/sessions/get?usid=${sessionId}&sauth=${USR_SESSION}`)
		.then((res) => res.json())
	if (row === null) {
		return { session: null, user: null };
	}
	const session: Session = {
		id: row[0],
		userId: row[1],
		expiresAt: new Date(row[2])
	};
	const user: User = {
		id: row[3]
	};
	// Delete the stale session
	if (Date.now() >= session.expiresAt.getTime()) {
		await invalidateSession(session.id);
		return { session: null, user: null };
	}
	// renew session
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		const res = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/sessions/renew?usid=${session.id}&expires_at=${session.expiresAt}&sauth=${USR_SESSION}`);

		if (!res.ok) {
			throw new Error("Failed to renew session");
		}
	}
	return { session, user };
}

/**
 * invalidateSession invalidates a session by deleting it from the database
 * @param sessionId the session id to invalidate
 * @returns void
 * @throws Error if the request fails
 */
export async function invalidateSession(sessionId: string): Promise<void> {
	const res = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/sessions/delete?usid=${sessionId}&sauth=${USR_SESSION}`);

	if (!res.ok) {
		throw new Error("Failed to invalidate session");
	}
}
/**
 * invalidateAllSessions invalidates all sessions for a user
 * @param userId the user id to invalidate all sessions for
 * @returns void
 * @throws Error if the request fails
 */
export async function invalidateAllSessions(userId: number): Promise<void> {
	const res = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/sessions/delete?uid=${userId}&sauth=${USR_SESSION}`);

	if (!res.ok) {
		throw new Error("Failed to invalidate all sessions");
	}
}

/**
 * invalidateStaleSessions invalidates all stale sessions
 * @returns void
 * @throws Error if the request fails
 */
export async function invalidateStaleSessions(): Promise<void> {
	const res = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/sessions/stale?sauth=${USR_SESSION}`);

	if (!res.ok) {
		throw new Error("Failed to invalidate stale sessions");
	}
}

/**
 * setSessionTokenCookie sets the session token cookie
 * @param context 
 * @param token 
 * @param expyiresAt 
 */
export function setSessionTokenCookie(context: APIContext, token: string, expyiresAt: Date): void {
	context.cookies.set("session", token, {
		httpOnly: true,
		// secure: import.meta.env.PROD,
		secure: true,
		sameSite: "lax",
		expires: expyiresAt,
		path: "/"
	});
}

/**
 * deleteSessionTokenCookie deletes the session token cookie
 * @param context 
 */
export function deleteSessionTokenCookie(context: APIContext): void {
	context.cookies.set("session", "", {
		httpOnly: true,
		sameSite: "lax",
		// secure: import.meta.env.PROD,
		secure: true,
		maxAge: 0,
		path: "/"
	});
}

/**
 * type SessionValidationResult is the result of a session validation
 */
export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

/**
 * interface Session represents a session in the database
 * @property id the session id
 * @property userId the user id
 * @property expiresAt the expiration date of the session
 */
export interface Session {
	id: string;
	userId: number;
	expiresAt: Date;
}

/**
 * interface User represents a user in the database
 * @property id the user id
 */
export interface User {
	id: number;
}