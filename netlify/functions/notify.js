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

    // extract data from the querystring
    const body = JSON.parse(event.body);
    const subject = body.subject;
    const emailBody = body.emailBody;

    // get environment variable
    const EMAIL = process.env.EMAIL;
    
    // verify data
    console.log("(notify.js) body: ", body);
    console.log("(notify.js) subject: ", subject);
    console.log("(notify.js) emailBody: ", emailBody);
    console.log("(notify.js) EMAIL:", EMAIL);

    // create a new email object with the environment variable
    const resend = new Resend(EMAIL);

    // send the email
    try {
        const result = await resend.emails.send({
            from: 'bloombuddy-notifications@resend.dev',
            to: 'ethan.crawford5532@gmail.com',
            subject: `${subject}`,
            html: `<p>${emailBody}</p>`
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "Email sent successfully", result }),
        };
    } catch (error) {
        console.error("Email send failed:", error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Failed to send email", details: error.message }),
        };
    }
}