import type { APIContext } from "astro";

/**
 * setSessionTokenCookie sets the session token cookie
 * @param context 
 * @param token 
 * @param expyiresAt 
 */
export function setSessionTokenCookie(context: APIContext, token: string, expyiresAt: Date): void {
    context.cookies.set("session", token, {
        httpOnly: true,
        secure: import.meta.env.PROD,
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
        secure: import.meta.env.PROD,
        maxAge: 0,
        path: "/"
    });
}
