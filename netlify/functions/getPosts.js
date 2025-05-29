// netlify/functions/getPosts.js

export async function handler(event, context) {
    const USR_DB = process.env.USR_DB

    try {
        const response = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/posts/get/a?auth=${USR_DB}`);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Optional for dev
            },
            body: JSON.stringify(response),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
}
