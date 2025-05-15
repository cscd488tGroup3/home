// filepath: /workspaces/home/src/pages/api/plant.js
import { getPlantRecommendations } from '../../src/lib/recommendations.js';

export async function GET({ url }) {
    const plantName = url.searchParams.get('name');
    if (!plantName) {
        return new Response(JSON.stringify({ error: 'Missing plant name' }), { status: 400 });
    }
    try {
        const data = await getPlantRecommendations(plantName);
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}