// filepath: /workspaces/home/src/pages/api/plant.js
import { getPlantRecommendations } from '../../src/lib/recommendations.js';

export async function handler(event) {
    const plantName = event.queryStringParameters?.name;
    if (!plantName) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing plant name' }),
        };
    }
    try {
        const data = await getPlantRecommendations(plantName);
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message }),
        };
    }
}