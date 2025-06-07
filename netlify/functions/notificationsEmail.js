import nodemailer from "nodemailer";

export async function handler(event) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    let email, subject, message;
    try {
        const body = JSON.parse(event.body);
        email = body.email;
        subject = body.subject || "Garden Reminder";
        message = body.message || "It's time to manage your garden!";
    } catch {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid JSON" }),
        };
    }

    if (!email) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Email is required" }),
        };
    }

    // Create a transporter using your team email credentials
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject,
            text: message,
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message }),
        };
    }
}