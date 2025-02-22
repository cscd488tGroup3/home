import { getUserByUid } from "../../server/d1-api.js";

export async function GET({ request, locals }) {
    const url = new URL(request.url);
    const uid = url.searchParams.get("uid");

    if (!uid) {
        return new Response(JSON.stringify({ error: "UID is required" }), { status: 400 });
    }

    try {
        const env = locals.runtime.env;
        const user = await getUserByUid(uid, env);

        if (user.length === 0) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
