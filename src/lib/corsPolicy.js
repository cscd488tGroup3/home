export const getCorsHeaders = (origin) => {
    const allowedOrigins = [
        "https://astro-d1-integration.ecrawford4.workers.dev",
        //"http://localhost:4321", // For local development
        "https://*--peppy-nougat-0120f1.netlify.app" // For Netlify deployment
    ];

    return {
        "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "https://cscd488group3-BloomBuddy.netlify.app", // Default to the first allowed origin
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };
};

export const handleOptionsRequest = (headers) => {
    return {
        statusCode: 204,
        headers,
        body: "",
    };
};