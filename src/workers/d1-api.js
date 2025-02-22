export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const params = new URLSearchParams(url.search);
        const apiKey = request.headers.get("Authorization");

        // Check for API key
        if (apiKey !== env.USR_DB_API_KEY) {
            return new Response("Unauthorized", { status: 401 });
        }
        console.log(params);

        // Handle your API routes
        if (url.pathname === "/api/info") {
            const { results } = await env.DB.prepare("SELECT * FROM info").all();
            return new Response(JSON.stringify(results), {
                headers: { "Content-Type": "application/json" },
            });
        }

        if (url.pathname === "/api/admin") {
            const { results } = await env.DB.prepare("SELECT * FROM admin").all();
            return new Response(JSON.stringify(results), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // Handle the root path
        if (url.pathname === "/") {
            return new Response("Welcome to your D1-powered API!", {
                headers: { "Content-Type": "text/plain" },
            });
        }

        // Handle favicon requests
        if (url.pathname === "/favicon.ico") {
            return new Response(null, { status: 204 }); // No content
        }

        // Fallback for unknown routes
        return new Response("Not found", { status: 404 });
    },
};