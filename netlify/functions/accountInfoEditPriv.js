export async function handler(event,context) {
    console.log("Incoming request origin:", event.headers.origin);
    // headers
    const allowedOrigins = [
        "https://astro-d1-integration.ecrawford4.workers.dev",
        //"http://localhost:4321", // For local development
        "https://*--cscd488group3-bloombuddy.netlify.app" // For Netlify deployment
    ];

    const origin = event.headers.origin;

    const headers = {
        "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "https://cscd488group3-bloombuddy.netlify.app", // Default to the first allowed origin
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };
    
    // handle prefilght request
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
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    const { username, priv } = JSON.parse(event.body);

    // Access server-side environment variables
    const USR_DB = process.env.USR_DB;
    const USR_DB_W = process.env.USR_DB_W;
    const USR_DB_W_ADMIN = process.env.USR_DB_W_ADMIN;

    try {
        const privResponse = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/api/priv/update?uid=${username}&priv=${priv}&auth=${USR_DB}&wauth=${USR_DB_W}&aauth=${USR_DB_W_ADMIN}`);
        if (privResponse.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify(privResponse),
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
    
}