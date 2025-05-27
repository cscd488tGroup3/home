import { Resend } from 'resend';

export async function handler(event, context) {
    const allowedOrigins = [
        "https://astro-d1-integration.ecrawford4.workers.dev",
        //"http://localhost:4321", // For local development
        "https://*--cscd488group3-bloombuddy.netlify.app" // For Netlify deployment
    ];

    const origin = event.headers.origin;

    const headers = {
        "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "https://cscd488group3-bloombuddy.netlify.app", // Default to the first allowed origin
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    // handle prefilght request
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 204,
            headers,
            body: "",
        };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    const EMAIL = process.env.EMAIL;

    const resend = new Resend(EMAIL);

    resend.emails.send({
        from: 'noreply@cscd488group3-bloombuddy.netlify.app',
        to: 'ethan.crawford5532@gmail.com',
        subject: 'Test Notification',
        html: '<h1>Test Notification</h1>'
    });
}