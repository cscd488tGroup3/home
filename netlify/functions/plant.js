import { getPlantRecommendations } from '../../src/lib/recommendations.js';

export async function handler(event) {
    console.log('Received event:', event);

    const plantName = event.queryStringParameters?.name;
    console.log('Plant name:', plantName);

    if (!plantName) {
        console.log('No plant name provided');
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing plant name' }),
        };
    }
    try {
        const data = await getPlantRecommendations(plantName);
        console.log('Plant recommendations:', data);
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (e) {
        console.error('Error in getPlantRecommendations:', e);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message }),
        };
    }
}
