export async function readUserInfoRequest({worker, uid, auth }) {
    const url = new URL(worker);
    url.searchParams.append('uid', uid);
    url.searchParams.append('auth', auth);

    //console.log(url.href);

    const response = await fetch(url.href);

    if (response.status === 200) {
        return response;
    } else {
        throw new Error(`Request failed: ${response.statusText}`);
    }
}