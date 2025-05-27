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

    const { username, fname } = JSON.parse(event.body);

    console.log(body);

    // Access server-side environment variables
    const USR_DB = process.env.USR_DB;

    try {
        const fNameResponse = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/api/edit/info?uid=${username}&fname=${fname}&auth=${USR_DB}`);
        if(fNameResponse.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify(fNameResponse),
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
}