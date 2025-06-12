// netlify/functions/getPosts.js

export async function handler(event, context) {
    const { gid } = JSON.parse(event.body);
    const USR_DB = process.env.USR_DB

    try {
        const response = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/groups/posts/get/a?gid=${gid}&auth=${USR_DB}`);
        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Optional for dev
            },
            body: JSON.stringify(data),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
}
