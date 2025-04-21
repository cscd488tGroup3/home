import { generateSessionToken } from "./authenticate";
import { createSession } from "./authenticate";

export async function handler(event,context) {
    console.log("Incoming request origin:", event.headers.origin);
    // headers
    const allowedOrigins = [
        "https://astro-d1-integration.ecrawford4.workers.dev",
        //"http://localhost:4321", // For local development
        "https://*--cscd488group3-bloombuddy.netlify.app" // For Netlify deployment
    ];

    const origin = event.headers.origin;

    console.log("Origin:", origin);

    const headers = {
        "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "https://cscd488group3-bloombuddy.netlify.app", // Default to the first allowed origin
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    console.log("Headers:", headers);
    
    // handle prefilght request
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers,
            body: "",
        };
    }    

    console.log("Preflight request handled");

    // Check if the request method is POST
    // If not, return a 405 Method Not Allowed response
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    console.log("POST request received");

    const body = JSON.parse(event.body);
    const uid = body.uid;
    const hashpass = body.hashpass;

    console.log("Request body:", body);
    console.log("UID:", uid);
    console.log("Hashpass:", hashpass);

    // Access server-side environment variables
    const USR_DB = process.env.USR_DB;

    console.log("Environment variable USR_DB:", USR_DB);

    // Query the database for the user
    const userCredentials = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/api/password?uid=${uid}&auth=${USR_DB}`);

    if (!userCredentials.ok) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Failed to fetch user credentials" }),
        };
    }

    console.log("User credentials response status:", userCredentials.status);

    const responseData = await userCredentials.json();

    console.log("User credentials response data:", responseData);

    if (!Array.isArray(responseData) || responseData.length === 0) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: "User not found" }),
        };
    }

    console.log("User credentials response data passing checks");

    const user = responseData[0];
    
    // DEBUGGING
    console.log("User credentials fetched:", user);
    console.log("Provided hash:", hashpass);
    console.log("Stored hash:", user.hashpass);

    if (user.hashpass !== hashpass) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: "Invalid credentials" }),
        };
    } else {
        // create a new session for the user
        const newToken = generateSessionToken();
        const session = await createSession(newToken, uid);

        if (!session) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: "Failed to create session" }),
            };
        } else {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(session),
            };
        }
    }
}