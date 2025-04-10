export async function POST({ request }) {
    const body = await request.json();
    const plantQuery = body.query;

    // Access server-side environment variables
    const TREFLE_API_KEY = import.meta.env.TREFLE_API_KEY;

    try {
        // Query the Trefle API
        const trefleResponse = await fetch(`https://trefle.io/api/v1/plants/search?q=${plantQuery}&token=${TREFLE_API_KEY}`);

        if (!trefleResponse.ok) {
            throw new Error('Failed to fetch plant information');
        }

        const plantInfo = await trefleResponse.json();

        return new Response(JSON.stringify(plantInfo), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}