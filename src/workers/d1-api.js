// This is your D1-powered API worker
// It's a Cloudflare Worker that uses Durable Objects

// get the user data from the database
import { getUserByUid } from './d1-func.js';
import { getInfoByUid } from './d1-func.js';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/api/admin") {
            const uid = url.searchParams.get("uid");
            if (!uid) {
                return new Response(JSON.stringify({ error: "UID is required" }), { status: 400 });
            }

            try {
                const user = await getUserByUid(uid, env);

                if (user.length === 0) {
                    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
                }

                return new Response(JSON.stringify(user), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            } catch (err) {
                return new Response(JSON.stringify({ error: err.message }), { status: 500 });
            }
        }

        if (url.pathname === "/api/info") {
            const uid = url.searchParams.get("uid");
            if (!uid) {
                return new Response(JSON.stringify({ error: "UID is required" }), { status: 400 });
            }

            try {
                const user = await getInfoByUid(uid, env);

                if (user.length === 0) {
                    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
                }

                return new Response(JSON.stringify(user), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            } catch (err) {
                return new Response(JSON.stringify({ error: err.message }), { status: 500 });
            }
        }

        return new Response("Not found", { status: 404 });
    },
};

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