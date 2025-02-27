export async function getUserByUid(uid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM admin WHERE uid = ?").bind(uid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

export async function getInfoByUid(uid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM info WHERE uid = ?").bind(uid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

export async function getPassword(uid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT hashpass FROM admin WHERE uid = ?").bind(uid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

export async function writeNewUser(uid, email, fname, lname, dob, doj, env) {
    try {
        const {results} = await env.DB.prepare("INSERT INTO info (uid, email, fname, lname, dob, doj) VALUES (?, '?', '?', '?', '?', '?');").bind(uid, email, fname, lname, dob, doj).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

export async function writeNewPassword(uid, hashpass, env) {
    try {
        const {results} = await env.DB.prepare("INSERT INTO admin (uid, email, hashpass) VALUES (?, '?', '?');").bind(uid, email, hashpass).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
