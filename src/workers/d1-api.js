// This is your D1-powered API worker
// It's a Cloudflare Worker that uses Durable Objects

// get the user data from the database
export async function getUserByUid(uid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM admin WHERE uid = ?")
            .bind(uid)
            .all();
        return results;
    } catch (error) {
        console.error("Database query error:", error);
        throw new Error("Failed to fetch user data");
    }
}

// get the info data from the database
export async function getInfoByUid(uid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM info WHERE uid = ?")
            .bind(uid)
            .all();
        return results;
    } catch (error) {
        console.error("Database query error:", error);
        throw new Error("Failed to fetch user data");
    }
}

// export default {
//     async fetch(request, env) {
//         const url = new URL(request.url);
//         const params = new URLSearchParams(url.search);
//         const apiKey = request.headers.get("Authorization");

//         // Check for API key
//         if (apiKey !== env.USR_DB_API_KEY) {
//             return new Response("Unauthorized", { status: 401 });
//         }
//         console.log(params);

//         // Handle your API routes
//         if (url.pathname === "/api/info" && params.has("uid")) {
//             const uid = params.get("uid");
//             const { results } = await env.DB.prepare("SELECT * FROM info WHERE uid = ?")
//                 .bind(uid)
//                 .all();
            
//             return new Response(JSON.stringify(results), {
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         if (url.pathname === "/api/admin" && params.has("uid")) {
//             const uid = params.get("uid");
//             const { results } = await env.DB.prepare("SELECT * FROM admin WHERE uid = ?")
//                 .bind(uid)
//                 .all();
            
//             return new Response(JSON.stringify(results), {
//                 headers: { "Content-Type": "application/json" },
//             });
//         }
//         // Handle the root path
//         if (url.pathname === "/") {
//             return new Response("Welcome to your D1-powered API!", {
//                 headers: { "Content-Type": "text/plain" },
//             });
//         }

//         // Handle favicon requests
//         if (url.pathname === "/favicon.ico") {
//             return new Response(null, { status: 204 }); // No content
//         }

//         // Fallback for unknown routes
//         return new Response("Not found", { status: 404 });
//     },
// };