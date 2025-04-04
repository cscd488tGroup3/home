import { Handler } from '@netlify/functions'
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

const USR_SESSION = process.env.USR_SESSION;

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(token: string, userId: number): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/sessions/new?id=${session.id}&uid=${session.userId}&expires_at=${session.expiresAt}&sauth=${USR_SESSION}`);
	return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const row = await db.queryOne(
		"SELECT user_session.id, user_session.user_id, user_session.expires_at, user.id FROM user_session INNER JOIN user ON user.id = user_session.user_id WHERE id = ?",
		sessionId
	);
	if (row === null) {
		return { session: null, user: null };
	}
	const session: Session = {
		id: row[0],
		userId: row[1],
		expiresAt: row[2]
	};
	const user: User = {
		id: row[3]
	};
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.execute("DELETE FROM user_session WHERE id = ?", session.id);
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db.execute(
			"UPDATE user_session SET expires_at = ? WHERE id = ?",
			session.expiresAt,
			session.id
		);
	}
	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.execute("DELETE FROM user_session WHERE id = ?", sessionId);
}

export async function invalidateAllSessions(userId: number): Promise<void> {
	await db.execute("DELETE FROM user_session WHERE user_id = ?", userId);
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

export interface Session {
	id: string;
	userId: number;
	expiresAt: Date;
}

export interface User {
	id: number;
}