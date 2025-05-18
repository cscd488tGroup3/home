const { getPlantRecommendations } = require('../../src/lib/recommendations.js');

exports.handler = async function(event) {
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
};
