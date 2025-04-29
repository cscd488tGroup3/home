// src/utils/getSession.ts
import { validateSessionToken } from "../lib/authenticate";
import type { APIContext } from "astro";

export async function getSession(context: APIContext) {
	const token = context.cookies.get("session")?.value ?? null;

	if (!token) {
		return { user: null, session: null };
	}

	return await validateSessionToken(token);
}
