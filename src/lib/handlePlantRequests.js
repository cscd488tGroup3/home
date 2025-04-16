import { queryTrefle, queryPerenual, queryRapid } from './queryAPIs';
import { getCorsHeaders, handleOptionsRequest } from './corsPolicy';

export async function POST(event) {
    const origin = event.headers?.origin || '*'; // Fallback to '*' if origin is undefined
    const headers = getCorsHeaders(origin);

    if (event.httpMethod === "OPTIONS") {
        return handleOptionsRequest(headers);
    }

    const body = await event.request.json();
    const { query, api } = body;

    try {
        let plantInfo;

        switch (api.toLowerCase()) {
            case 'trefle':
                plantInfo = await queryTrefle(query);
                break;
            case 'perenual':
                plantInfo = await queryPerenual(query);
                break;
            case 'rapid':
                plantInfo = await queryRapid(query);
                break;
            default:
                throw new Error('Invalid API specified');
        }

        return new Response(JSON.stringify(plantInfo), {
            status: 200,
            headers,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers,
        });
    }
}