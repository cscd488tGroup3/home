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

export async function createNewUserAccount({ adminWorker, userWorker, uid, email, fname, lname, dob, doj, hashpass, auth, wauth, aauth }) {
    // const auth = import.meta.env.USR_DB;
    // const wauth = import.meta.env.USR_DB_W;
    // const aauth = import.meta.env.USR_DB_W_AUTH;

    const aurl = new URL(adminWorker);
    aurl.searchParams.append('uid', uid);
    aurl.searchParams.append('email', email);
    aurl.searchParams.append('hashpass', hashpass);
    aurl.searchParams.append('auth', auth);
    aurl.searchParams.append('wauth', wauth);
    aurl.searchParams.append('aauth', aauth);

    const uurl = new URL(userWorker);
    uurl.searchParams.append('uid', uid);
    uurl.searchParams.append('email', email);
    uurl.searchParams.append('fname', fname);
    uurl.searchParams.append('lname', lname);
    uurl.searchParams.append('dob', dob);
    uurl.searchParams.append('doj', doj);
    uurl.searchParams.append('auth', auth);
    uurl.searchParams.append('wauth', wauth);

    const [aresponse, uresponse] = await Promise.all([fetch(aurl.href), fetch(uurl.href)]);

    if (aresponse.ok && uresponse.ok) {
        return { admin: await aresponse.json(), user: await uresponse.json() };
    } else {
        throw new Error(`Request failed: ${aresponse.statusText}; ${uresponse.statusText}`);
    }
}