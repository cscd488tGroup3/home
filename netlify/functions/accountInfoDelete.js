export async function handler(event, context) {
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

    // prepare variables from request body
    const body = JSON.parse(event.body);
    const uid = body.username;
    const hashpass = body.hashpass;
    
    console.log("Data: ", body);
    console.log("uid: ", uid);
    console.log("hashpass: ", hashpass);

    // Access server-side environment variables
    const USR_DB = process.env.USR_DB;
    const USR_DB_W = process.env.USR_DB_W;
    const USR_DB_W_ADMIN = process.env.USR_DB_W_ADMIN;

    try {
        const DOBResponse = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/api/deleteuser?uid=${uid}&hashpass=${hashpass}&auth=${USR_DB}&wauth=${USR_DB_W}&aauth=${USR_DB_W_ADMIN}`);
        if (DOBResponse.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify(DOBResponse),
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
}