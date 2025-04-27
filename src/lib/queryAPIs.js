import { getCorsHeaders, handleOptionsRequest } from './corsPolicy.js';

// For Trefle API
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

// Placeholder for Plant API 2
export async function queryPerenual(plantQuery) {
    const PERENUAL_KEY = import.meta.env.PERENUAL_KEY;

    try {
        const PerenualResponse = await fetch(`https://perenual.com/api/v2/species-list?key=${PERENUAL_KEY}&q=${plantQuery}`);

        if (!PerenualResponse.ok) {
            throw new Error('Failed to fetch plant information from Plant API 2');
        }

        return await PerenualResponse.json();
    } catch (error) {
        throw new Error(`Plant API 2 Error: ${error.message}`);
    }
}


// Placeholder for Plant API 3 (may not be used, API requires plant id for specific plant information which would be odd to use in a search)
/*
export async function queryRapid(plantQuery) {
    const X_RAPIDAPI_KEY = import.meta.env.X_RAPIDAPI_KEY;

    try {
        const RapidResponse = await fetch(`https://Rapid.example.com/search?query=${plantQuery}&apiKey=${X_RAPIDAPI_KEY}`);

        if (!RapidResponse.ok) {
            throw new Error('Failed to fetch plant information from Plant API 3');
        }

        return await RapidResponse.json();
    } catch (error) {
        throw new Error(`Plant API 3 Error: ${error.message}`);
    }
}
*/


// For Geolocation API
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