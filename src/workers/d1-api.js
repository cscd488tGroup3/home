// D1-powered Cloudflare API worker
import { getUserByUid } from './d1-func.js';
import { getInfoByUid } from './d1-func.js';
import { getPasswordByUid } from './d1-func.js';
import { getPasswordByEmail } from './d1-func.js';
import { writeNewUser } from './d1-func.js';
import { writeNewPassword } from './d1-func.js';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        
        // passed in keys
        const auth = url.searchParams.get("auth");
        const wauth = url.searchParams.get("wauth");
        const aauth = url.searchParams.get("aauth");

        // check for the read key
        if (!auth || auth !== env.USR_DB) {
            return new Response("Unauthorized", { status: 401 });
        }

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

        if (url.pathname === "/api/password") {
            const uid = url.searchParams.get("uid");
            const email = url.searchParams.get("email");

            if (!uid) {
                if (!email) {
                    return new Response(JSON.stringify({ error: "UID or email is required" }), { status: 400 });
                }

                try {
                    const hashpass = await getPasswordByEmail(email, env);

                    if (hashpass.length === 0) {
                        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
                    }

                    return new Response(JSON.stringify(hashpass), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    });
                } catch (err) {
                    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
                }
            }

            try {
                const hashpass = await getPasswordByUid(uid, env);

                if (hashpass.length === 0) {
                    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
                }

                return new Response(JSON.stringify(hashpass), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            } catch (err) {
                return new Response(JSON.stringify({ error: err.message }), { status: 500 });
            }
        }

        // check for the write key
        if (!wauth || wauth !== env.USR_DB_W) {
            return new Response("Unauthorized", { status: 401 });
        }
        
        if (url.pathname === "/api/write/info") {
            const uid = url.searchParams.get("uid");
            const email = url.searchParams.get("email");
            const fname = url.searchParams.get("fname");
            const lname = url.searchParams.get("lname");
            const dob = url.searchParams.get("dob");
            const doj = url.searchParams.get("doj");
            if(!uid || !email || !fname || !lname || !dob || !doj) {
                return new Response(JSON.stringify({ error: "bad params" }), { status: 400 });
            }

            try {
                const response = await writeNewUser(uid, email, fname, lname, dob, doj, env);
                return new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            }
            catch (err) {
                return new Response(JSON.stringify({ error: err.message }), { status: 500 });
            }
        }

        // check for the admin key
        if (!aauth || aauth !== env.USR_DB_W_ADMIN) {
            return new Response("Unauthorized", { status: 401 });
        }

        if (url.pathname === "/api/write/admin") {
            const uid = url.searchParams.get("uid");
            const email = url.searchParams.get("email");
            const hashpass = url.searchParams.get("hashpass");
            if(!uid || !email || !hashpass) {
                return new Response(JSON.stringify({ error: "bad params" }), { status: 400 });
            }

            try {
                const response = await writeNewPassword(uid, email, hashpass, env);
                return new Response(JSON.stringify(response), {
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