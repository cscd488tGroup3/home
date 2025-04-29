import { generateSessionToken } from "./authenticate";
import { createSession } from "./authenticate";

export async function handler(event, context) {
    const headers = {
        "Access-Control-Allow-Origin": "https://cscd488group3-bloombuddy.netlify.app",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 204, headers, body: "" };
    }

    const body = JSON.parse(event.body);
    const uid = body.username;
    const hashpass = body.hashpass;
    const rememberMe = body.rememberMe === "on"; // sent by form checkbox

    // ... validation and hash comparison logic ...

    if (user.hashpass !== hashpass) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: "Invalid credentials" }),
        };
    }

    const newToken = generateSessionToken();
    const session = await createSession(newToken, uid);

    if (!session) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Failed to create session" }),
        };
    }

    // ➕ Add Set-Cookie header
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 2; // 30 days vs 2 hours
    const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
    const cookie = `session=${session.id}; Path=/; HttpOnly; Secure; SameSite=Strict; Expires=${expires}; Max-Age=${maxAge}`;

    return {
        statusCode: 200,
        headers: {
            ...headers,
            "Set-Cookie": cookie,
        },
        body: JSON.stringify({ success: true }),
    };
}
