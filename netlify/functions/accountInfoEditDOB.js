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

   
    const { username, dob } = JSON.parse(event.body);

    console.log({ username, dob });

    // Access server-side environment variables
    const USR_DB = process.env.USR_DB;
    const USR_DB_W = process.env.USR_DB_W;

    try {
        const DOBResponse = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/api/edit/info?uid=${username}&dob=${dob}&auth=${USR_DB}&wauth=${USR_DB_W}`);
        if(DOBResponse.ok) {
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