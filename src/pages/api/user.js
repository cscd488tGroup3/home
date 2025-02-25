import { getUserByUid } from "../../workers/d1-func.js";
import { getInfoByUid } from "../../workers/d1-func.js";

export async function GET({ request, locals }) {
    const url = new URL(request.url);
    const uid = url.searchParams.get("uid");
    const auth = url.searchParams.get("auth");

    if (!auth || auth !== locals.USR_DB) {
        return new Response("Unauthorized", { status: 401 });
    }

    if (!uid) {
        return new Response(JSON.stringify({ error: "UID is required" }), { status: 400 });
    }

    try {
        const env = locals.runtime.env;
        
        if (type === "user") {
            const user = await getUserByUid(uid, env);
            if (user.length === 0) {
                return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
            }
            return new Response(JSON.stringify(user), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } else if (type === "info") {
            const info = await getInfoByUid(uid, env);
            if (info.length === 0) {
                return new Response(JSON.stringify({ error: "Info not found" }), { status: 404 });
            }
            return new Response(JSON.stringify(info), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } else {
            return new Response(JSON.stringify({ error: "Invalid type parameter" }), { status: 400 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
