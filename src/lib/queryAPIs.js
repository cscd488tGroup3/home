import { getCorsHeaders, handleOptionsRequest } from './corsPolicy.js';

// Commenting out Trefle API functionality
/*
export async function queryTrefle(plantQuery) {
    const TREFLE_API_KEY = import.meta.env.TREFLE_API_KEY;
    const url = `https://trefle.io/api/v1/plants/search?q=${plantQuery}&token=${TREFLE_API_KEY}`;
    console.log(`Querying Trefle API: ${url}`); // Log the request URL

    try {
        const trefleResponse = await fetch(url);
        console.log(`Trefle API response status: ${trefleResponse.status}`); // Log the response status

        if (!trefleResponse.ok) {
            throw new Error('Failed to fetch plant information from Trefle API');
        }

        const data = await trefleResponse.json();
        console.log(`Trefle API response data: ${JSON.stringify(data)}`); // Log the response data
        return data;
    } catch (error) {
        console.error(`Trefle API Error: ${error.message}`); // Log the error
        throw new Error(`Trefle API Error: ${error.message}`);
    }
}
*/

// Keeping Perenual API functionality
export async function queryPerenual(plantQuery) {
    const PERENUAL_KEY = import.meta.env.PERENUAL_KEY;

    try {
        const response = await fetch(`https://perenual.com/api/species-care-guide-list?key=${PERENUAL_KEY}&q=${plantQuery}`);
        if (!response.ok) {
            throw new Error('Failed to fetch plant information from Perenual API');
        }
        const result = await response.json();
        return result.data; // Only return the array of plants
    } catch (error) {
        throw new Error(`Perenual API Error: ${error.message}`);
    }
}

/**
 * Fetch detailed plant information from the Perenual API using the plant ID.
 * @param {number} plantId - The ID of the plant.
 * @returns {Promise<Object>} - Detailed plant information.
 */
export async function queryPerenualDetails(plantId) {
    const PERENUAL_KEY = import.meta.env.PERENUAL_KEY;

    try {
        const response = await fetch(`https://perenual.com/api/v2/species/details/${plantId}?key=${PERENUAL_KEY}`);

        if (!response.ok) {
            throw new Error('Failed to fetch detailed plant information from Perenual API');
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Perenual API Details Error: ${error.message}`);
    }
}

// Commenting out Rapid API functionality
/*
export async function queryRapid(plantQuery) {
    const X_RAPIDAPI_KEY = import.meta.env.X_RAPIDAPI_KEY;

    try {
        const RapidResponse = await fetch(`https://Rapid.example.com/search?query=${plantQuery}&apiKey=${X_RAPIDAPI_KEY}`);

        if (!RapidResponse.ok) {
            throw new Error('Failed to fetch plant information from Rapid API');
        }

        return await RapidResponse.json();
    } catch (error) {
        throw new Error(`Rapid API Error: ${error.message}`);
    }
}
*/

// Commenting out Geolocation API functionality
/*
export async function queryGeoLocation(locationQuery) {
    const GEO_API_KEY = import.meta.env.GEO_API_KEY;

    try {
        const geoResponse = await fetch(`https://geoapi.example.com/location?query=${locationQuery}&key=${GEO_API_KEY}`);

        if (!geoResponse.ok) {
            throw new Error('Failed to fetch location information from Geolocation API');
        }

        return await geoResponse.json();
    } catch (error) {
        throw new Error(`Geolocation API Error: ${error.message}`);
    }
}
*/