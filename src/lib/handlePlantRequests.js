import { queryPerenual /*, queryTrefle, queryRapid */ } from './queryAPIs';
import { getCorsHeaders, handleOptionsRequest } from './corsPolicy';

export async function POST(event) {
    const origin = event.headers?.origin || '*'; // Fallback to '*' if origin is undefined
    const headers = getCorsHeaders(origin);

    if (event.httpMethod === "OPTIONS") {
        return handleOptionsRequest(headers);
    }

    const body = await event.request.json();
    console.log(`Request body: ${JSON.stringify(body)}`); // Log the request body
    const { query, api } = body;

    try {
        let plantInfo;
        console.log(`Selected API: ${api}`); // Log the selected API

        switch (api.toLowerCase()) {
            // Commented out Trefle API functionality
            /*
            case 'trefle':
                console.log(`Querying Trefle API with query: ${query}`);
                plantInfo = await queryTrefle(query);
                break;
            */

            case 'perenual':
                console.log(`Querying Perenual API with query: ${query}`);
                plantInfo = await queryPerenual(query);
                break;

            // Commented out Rapid API functionality
            /*
            case 'rapid':
                console.log(`Querying Rapid API with query: ${query}`);
                plantInfo = await queryRapid(query);
                break;
            */

            default:
                throw new Error('Invalid API specified');
        }

        console.log(`API response: ${JSON.stringify(plantInfo)}`); // Log the API response
        return new Response(JSON.stringify(plantInfo), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error(`Error occurred: ${error.message}`); // Log the error
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers,
        });
    }
}