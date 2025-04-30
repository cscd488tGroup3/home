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
    const rememberMe = body.rememberMe === "on"; // from form checkbox

    // Query the database for the user
    const USR_DB = process.env.USR_DB;
    const userCredentials = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/api/password?uid=${uid}&auth=${USR_DB}`);

    if (!userCredentials.ok) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Failed to fetch user credentials" }),
        };
    }

    const responseData = await userCredentials.json();
    if (!Array.isArray(responseData) || responseData.length === 0) {
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: "User not found" }),
        };
    }

    const user = responseData[0];

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

    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 2; // 30 days or 2 hours
    const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
    const cookie = `session=${session.id}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${expires}; Max-Age=${maxAge}`;


    return {
        statusCode: 200,
        headers,
        multiValueHeaders: {
            "Set-Cookie": [cookie],
        },
        body: JSON.stringify({ success: true }),
    };
}
