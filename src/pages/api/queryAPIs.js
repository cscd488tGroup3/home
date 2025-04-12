// For Trefle API
export async function queryTrefle(plantQuery) {
    const TREFLE_API_KEY = import.meta.env.TREFLE_API_KEY;

    try {
        const trefleResponse = await fetch(`https://trefle.io/api/v1/plants/search?q=${plantQuery}&token=${TREFLE_API_KEY}`);

        if (!trefleResponse.ok) {
            throw new Error('Failed to fetch plant information from Trefle API');
        }

        return await trefleResponse.json();
    } catch (error) {
        throw new Error(`Trefle API Error: ${error.message}`);
    }
}

// Placeholder for Plant API 2
export async function queryPlantAPI2(plantQuery) {
    const API2_KEY = import.meta.env.API2_KEY;

    try {
        const api2Response = await fetch(`https://api2.example.com/plants?q=${plantQuery}&key=${API2_KEY}`);

        if (!api2Response.ok) {
            throw new Error('Failed to fetch plant information from Plant API 2');
        }

        return await api2Response.json();
    } catch (error) {
        throw new Error(`Plant API 2 Error: ${error.message}`);
    }
}

// Placeholder for Plant API 3
export async function queryPlantAPI3(plantQuery) {
    const API3_KEY = import.meta.env.API3_KEY;

    try {
        const api3Response = await fetch(`https://api3.example.com/search?query=${plantQuery}&apiKey=${API3_KEY}`);

        if (!api3Response.ok) {
            throw new Error('Failed to fetch plant information from Plant API 3');
        }

        return await api3Response.json();
    } catch (error) {
        throw new Error(`Plant API 3 Error: ${error.message}`);
    }
}

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