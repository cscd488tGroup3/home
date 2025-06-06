export async function handler(event,context) {
    console.log("Incoming request origin:", event.headers.origin);
    // headers
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

    const body = JSON.parse(event.body);

    // Access server-side environment variables
    const USR_DB = process.env.USR_DB;
    const USR_DB_W = process.env.USR_DB_W;
    const USR_DB_W_ADMIN = process.env.USR_DB_W_ADMIN;

    try {
        // Prepare data for password storage
        const passData = {
            uid: body.uid,
            email: body.email,
            hashpass: body.hashpass,
        };
        
        // Send password data to worker
        const passResponse = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/api/write/admin?uid=${passData.uid}&email=${passData.email}&hashpass=${passData.hashpass}&auth=${USR_DB}&wauth=${USR_DB_W}&aauth=${USR_DB_W_ADMIN}`);

        console.log("passResponse: ", passResponse);

        if (!passResponse.ok) {
            throw new Error('Failed to write account password');
        }

        // Prepare data for account info
        const accountInfo = {
            uid: body.uid,
            fname: body.fname,
            lname: body.lname,
            dob: body.dob,
            doj: new Date().toISOString().split('T')[0],
        };

        // Send account info to worker
        const infoResponse = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/api/write/info?uid=${accountInfo.uid}&fname=${accountInfo.fname}&lname=${accountInfo.lname}&dob=${accountInfo.dob}&doj=${accountInfo.doj}&auth=${USR_DB}&wauth=${USR_DB_W}`);

        console.log("infoResponse: ", infoResponse);
        
        if (!infoResponse.ok) {
            throw new Error('Failed to write account info');
        }

        const privResponse = await fetch(`https://astro-d1-integration.ecrawford4.workers.dev/api/priv/init?uid=${accountInfo.uid}&auth=${USR_DB}&wauth=${USR_DB_W}`);

        console.log("privResponse: ", privResponse);
        
        if (!privResponse.ok) {
            throw new Error('Failed to initialize account privacy settings');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Account created successfully!' }),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
}
