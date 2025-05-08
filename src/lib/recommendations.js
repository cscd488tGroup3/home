import { queryPerenual } from './queryAPIs.js';

/** 
  @param {string} plantQuery - The plant search query.
  @returns {Promise<Object>} - A care plan for the recommended plant.
 */
export async function getPlantRecommendations(plantQuery) {
    try {
        // Step 1: Search for plants
        const apiResults = await queryPerenual(plantQuery);

        if (!apiResults.data || apiResults.data.length === 0) {
            throw new Error('No plants found for the given query.');
        }

        // Step 2: Extract the ID of the first plant
        const plantId = apiResults.data[0].id;

        // Step 3: Fetch detailed information
        const plantDetails = await queryPerenualDetails(plantId);

        // Step 4: Generate a care plan
        const carePlan = {
            commonName: plantDetails.common_name || 'Unknown',
            scientificName: plantDetails.scientific_name?.join(', ') || 'Unknown',
            watering: plantDetails.watering || 'Unknown',
            sunlight: plantDetails.sunlight?.join(', ') || 'Unknown',
            cycle: plantDetails.cycle || 'Unknown',
            description: plantDetails.description || 'No description available.',
        };

        return carePlan;
    } catch (error) {
        console.error('Error generating recommendations:', error.message);
        throw new Error('Failed to generate plant recommendations.');
    }
}