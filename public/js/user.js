export async function readUserInfoRequest({ worker, uid, auth }) {
    const response = await fetch(worker, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, auth })
    });

    if (response.status === 200) {
        return response;
    } else {
        const text = await response.text();
        throw new Error(`Request failed: ${response.status} - ${text}`);
    }
}
