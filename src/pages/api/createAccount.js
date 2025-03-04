export async function post({ request }) {
    const body = await request.json();

    // Access server-side environment variables
    const USR_DB = import.meta.env.USR_DB;
    const USR_DB_W = import.meta.env.USR_DB_W;
    const USR_DB_W_AUTH = import.meta.env.USR_DB_W_AUTH;

    try {
        // Prepare data for account info
        const accountInfo = {
            uid: body.uid,
            email: body.email,
            fname: body.fname,
            lname: body.lname,
            dob: body.dob,
            doj: new Date().toISOString().split('T')[0], // Set date of joining
        };

        // Send account info to worker
        const infoResponse = await fetch('https://astro-d1-integration.ecrawford4.workers.dev/api/write/info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ...accountInfo,
                auth: USR_DB,
                wauth: USR_DB_W
            }),
        });

        if (!infoResponse.ok) {
            throw new Error('Failed to write account info');
        }

        // Prepare data for password storage
        const passData = {
            uid: body.uid,
            email: body.email,
            hashpass: body.hashpass,
        };

        // Send password data to worker
        const passResponse = await fetch('https://astro-d1-integration.ecrawford4.workers.dev/api/write/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ...passData,
                auth: USR_DB,
                wauth: USR_DB_W,
                aauth: USR_DB_W_AUTH
            }),
        });

        if (!passResponse.ok) {
            throw new Error('Failed to write account password');
        }

        return new Response(JSON.stringify({ message: 'Account created successfully!' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
