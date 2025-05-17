import { queryPerenual } from './queryAPIs.js';

/** 
  @param {string} plantQuery - The plant search query.
  @returns {Promise<Object>} - A care plan for the recommended plant.
 */
export async function getPlantRecommendations(plantQuery) {
    try {
        const apiResults = await queryPerenual(plantQuery);

        if (!apiResults || apiResults.length === 0) {
            throw new Error('No plants found for the given query.');
        }

        const plant = apiResults[0];

        // Extract care sections by type
        const careSections = {};
        if (plant.section && Array.isArray(plant.section)) {
            plant.section.forEach(sec => {
                careSections[sec.type] = sec.description;
            });
        }

        // These fields may not exist in the API response
        const carePlan = {
            commonName: plant.common_name || 'Unknown',
            scientificName: plant.scientific_name?.join(', ') || 'Unknown',
            type: plant.type || 'Unknown', // may not exist
            cycle: plant.cycle || 'Unknown', // may not exist
            description: plant.description || 'No description available.', // may not exist
            default_image: plant.default_image || undefined, // may not exist
            watering: careSections.watering || 'No watering info.',
            sunlight: careSections.sunlight || 'No sunlight info.',
            pruning: careSections.pruning || 'No pruning info.',
        };

        return carePlan;
    } catch (error) {
        console.error('Error generating recommendations:', error.message);
        throw new Error('Failed to generate plant recommendations.');
    }
}
