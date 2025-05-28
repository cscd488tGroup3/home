export async function handler(event, context) {
    console.log("Incoming request origin:", event.headers.origin);

    const allowedOrigins = [
        "https://astro-d1-integration.ecrawford4.workers.dev",
        "https://cscd488group3-bloombuddy.netlify.app"
    ];

    const origin = event.headers.origin;

    const headers = {
        "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "https://cscd488group3-bloombuddy.netlify.app",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers,
            body: "",
        };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    let uid;
    try {
        const body = JSON.parse(event.body);
        uid = body.uid;
    } catch (err) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "Invalid JSON" }),
        };
    }

    if (!uid) {
        console.log("No UID found");
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "UID is required" }),
        };
    }

    const USR_DB = process.env.USR_DB;
    if (!USR_DB) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Missing server configuration" }),
        };
    }

    try {
        const emailResponse = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/api/admin?uid=${uid}&auth=${USR_DB}`);
        const data = await emailResponse.json();

        if (!emailResponse.ok) {
            throw new Error(data?.error || "Unknown error from DB API");
        }

        return {
            statusCode: 200,
            headers,
            body: emailResponse,
        };
    } catch (e) {
        console.error('Database error:', e);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: e.message }),
        };
    }
}
