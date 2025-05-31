export async function handler(event) {
    const { pid, uid, caption, cloudinaryUrl } = Object.fromEntries(new URLSearchParams(event.body));

    const USR_DB = process.env.USR_DB

    try {
        const res = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/post/create?pid=${pid}&caption=${encodeURIComponent(caption)}&url=${encodeURIComponent(cloudinaryUrl)}&uid=${uid}&auth=${USR_DB}`);
        const data = await res.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message }),
        };
    }
}
