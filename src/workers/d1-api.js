// D1-powered Cloudflare API worker
import { getUserByUid } from './d1-func.js';
import { getInfoByUid } from './d1-func.js';
import { getPasswordByUid } from './d1-func.js';
import { getPasswordByEmail } from './d1-func.js';
import { writeNewUser } from './d1-func.js';
import { writeNewPassword } from './d1-func.js';

function addCorsHeaders(response) {
    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", "https://peppy-nougat-0120f1.netlify.app/"); // Or your specific frontend URL
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return new Response(response.body, { ...response, headers });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Handle preflight OPTIONS requests
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "https://peppy-nougat-0120f1.netlify.app/",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    "Access-Control-Max-Age": "86400", // Cache preflight for 24 hours
                },
            });
        }
        
        // passed in keys
        const auth = url.searchParams.get("auth");
        const wauth = url.searchParams.get("wauth");
        const aauth = url.searchParams.get("aauth");

        // check for the read key
        if (!auth || auth !== env.USR_DB) {
            return addCorsHeaders(new Response("Unauthorized", { status: 401 }));
        }

        if (url.pathname === "/api/admin") {
            const uid = url.searchParams.get("uid");
            if (!uid) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "UID is required" }), { status: 400 }));
            }

            try {
                const user = await getUserByUid(uid, env);

                if (user.length === 0) {
                    return addCorsHeaders(new Response(JSON.stringify({ error: "User not found" }), { status: 404 }));
                }

                return addCorsHeaders(new Response(JSON.stringify(user), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        if (url.pathname === "/api/info") {
            const uid = url.searchParams.get("uid");
            if (!uid) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "UID is required" }), { status: 400 }));
            }

            try {
                const user = await getInfoByUid(uid, env);

                if (user.length === 0) {
                    return addCorsHeaders(new Response(JSON.stringify({ error: "User not found" }), { status: 404 }));
                }

                return addCorsHeaders(new Response(JSON.stringify(user), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        if (url.pathname === "/api/password") {
            const uid = url.searchParams.get("uid");
            const email = url.searchParams.get("email");

            if (!uid) {
                if (!email) {
                    return addCorsHeaders(new Response(JSON.stringify({ error: "UID or email is required" }), { status: 400 }));
                }

                try {
                    const hashpass = await getPasswordByEmail(email, env);

                    if (hashpass.length === 0) {
                        return addCorsHeaders(new Response(JSON.stringify({ error: "User not found" })), { status: 404 });
                    }

                    return addCorsHeaders(new Response(JSON.stringify(hashpass), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    }));
                } catch (err) {
                    return addCorsHeaders(new Response(JSON.stringify({ error: err.message })), { status: 500 });
                }
            }

            try {
                const hashpass = await getPasswordByUid(uid, env);

                if (hashpass.length === 0) {
                    return addCorsHeaders(new Response(JSON.stringify({ error: "User not found" })), { status: 404 });
                }

                return addCorsHeaders(new Response(JSON.stringify(hashpass), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // check for the write key
        if (!wauth || wauth !== env.USR_DB_W) {
            return addCorsHeaders(new Response("Unauthorized", { status: 401 }));
        }
        
        if (url.pathname === "/api/write/info") {
            const uid = url.searchParams.get("uid");
            const email = url.searchParams.get("email");
            const fname = url.searchParams.get("fname");
            const lname = url.searchParams.get("lname");
            const dob = url.searchParams.get("dob");
            const doj = url.searchParams.get("doj");
            if(!uid || !email || !fname || !lname || !dob || !doj) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "bad params" }), { status: 400 }));
            }

            try {
                const response = await writeNewUser(uid, email, fname, lname, dob, doj, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            }
            catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // check for the admin key
        if (!aauth || aauth !== env.USR_DB_W_ADMIN) {
            return addCorsHeaders(new Response("Unauthorized", { status: 401 }));
        }

        if (url.pathname === "/api/write/admin") {
            const uid = url.searchParams.get("uid");
            const email = url.searchParams.get("email");
            const hashpass = url.searchParams.get("hashpass");
            if(!uid || !email || !hashpass) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "bad params" }), { status: 400 }));
            }

            try {
                const response = await writeNewPassword(uid, email, hashpass, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        return addCorsHeaders(new Response("Not found", { status: 404 }));
    },
};