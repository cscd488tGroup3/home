export async function handler(event, context) {
    const USR_DB = process.env.USR_DB;
    const pid = event.queryStringParameters?.pid;

    if (!pid) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing 'pid' query parameter" }),
        };
    }

    try {
        const response = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/comment/get/p/all?pid=${encodeURIComponent(pid)}&auth=${USR_DB}`);
        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(data), // ✅ correct value
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
}
