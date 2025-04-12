import { queryTrefle, queryPlantAPI2, queryPlantAPI3 } from './queryAPIs';

export async function POST({ request }) {
    const body = await request.json();
    const { query, api } = body; // Expecting `api` to specify which API to query

    try {
        let plantInfo;

        // Determine which API to query based on the `api` parameter
        switch (api) {
            case 'trefle':
                plantInfo = await queryTrefle(query);
                break;
            case 'api2':
                plantInfo = await queryPlantAPI2(query);
                break;
            case 'api3':
                plantInfo = await queryPlantAPI3(query);
                break;
            default:
                throw new Error('Invalid API specified');
        }

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