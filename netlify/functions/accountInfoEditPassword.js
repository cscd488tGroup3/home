/**
 * 
 * @param {*} event 
 * @param {*} context 
 * @returns 
 */
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

    const { username, password } = JSON.parse(event.body);

    // Access server-side environment variables
    const USR_DB = process.env.USR_DB;
    const USR_DB_W = process.env.USR_DB_W;
    const USR_DB_W_ADMIN = process.env.USR_DB_W_ADMIN;

    const hashpass = await hashPassword(password);
    
    try {
        const lNameResponse = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/api/edit/info?uid=${username}&hashpass=${hashpass}&auth=${USR_DB}&wauth=${USR_DB_W}&aauth=${USR_DB_W_ADMIN}`);
        if (lNameResponse.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify(lNameResponse),
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
}

/**
 * The hashPassword function returns the SHA-256 hash of the user's password
 * @param {String} password representing the password
 * @returns hashpass reprsenting the hashed password
 */
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}