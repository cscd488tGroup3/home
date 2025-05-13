/* 
    This file contains the functions that interact with the database.
    The functions are used in the worker (./d1-api.js) to perform database operations.
*/

/**
 * getUserByUid - query all admin table info by uid
 * @param {uid} uid 
 * @param {env} env 
 * @returns json representing the user info
 */
export async function getUserByUid(uid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM admin WHERE uid = ?").bind(uid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * getInfoByUid - query all info table info by uid
 * @param {uid} uid 
 * @param {env} env 
 * @returns json representing the user info
 */
export async function getInfoByUid(uid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM info WHERE uid = ?").bind(uid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * getPasswordByUid - query the admin table for the hashed password by uid
 * @param {uid} uid 
 * @param {env} env 
 * @returns json representing the hashed password
 */
export async function getPasswordByUid(uid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT hashpass FROM admin WHERE uid = ?").bind(uid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * getPasswordByEmail - query the admin table for the hashed password by email
 * @param {email} email 
 * @param {env} env 
 * @returns json representing the hashed password
 */
export async function getPasswordByEmail(email, env) {
    try {
        const { results } = await env.DB.prepare("SELECT hashpass FROM admin WHERE email = ?").bind(email).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * writeNewUser - insert a new user into the info table
 * @param {String} uid 
 * @param {String} fname 
 * @param {String} lname 
 * @param {Date} dob 
 * @param {Date} doj 
 * @param {*} env 
 * @returns status message of the database
 */
export async function writeNewUser(uid, fname, lname, dob, doj, env) {
    try {
        const {results} = await env.DB.prepare("INSERT INTO info (uid, fname, lname, dob, doj) VALUES (?, ?, ?, ?, ?);").bind(uid, fname, lname, dob, doj).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * writeNewPassword - insert a new user into the admin table
 * @param {String} uid 
 * @param {String} email 
 * @param {*} hashpass 
 * @param {*} env 
 * @returns status message of the database
 */
export async function writeNewPassword(uid, email, hashpass, env) {
    // if (!env.DB) throw new Error("Database not initialized");

    try {
        const {results} = await env.DB.prepare("INSERT INTO admin (uid, email, hashpass) VALUES (?, ?, ?);").bind(uid, email, hashpass).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/// untested implementation ///

/**
 * addSession - insert a new session into the user_session table
 * @param {*} usid the session id
 * @param {String} uid the user id
 * @param {Date} expires_at the date and time of expiration in ISO format
 * @param {*} env  
 * @returns 
 */
export async function addSession(usid, uid, expires_at, env) {
    try {
        const {results} = await env.DB.prepare("INSERT INTO user_session (usid, uid, expires_at) VALUES (?, ?, ?);").bind(usid, uid, expires_at).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * getSession - query the user_session table for the session id and the expiration date
 * @param {*} usid 
 * @param {*} env 
 * @returns 
 */
export async function getSession(usid, env) {
    try {
        const {results} = await env.DB.prepare("SELECT * FROM user_session WHERE usid = ?").bind(usid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * getAllSessions - query the user_session table for the session id and the expiration date
 * @param {String} uid 
 * @param {*} env 
 * @returns 
 */
export async function getAllSessions(uid, env) {
    try {
        const {results} = await env.DB.prepare("SELECT * FROM user_session WHERE uid = ?").bind(uid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * deleteSession - delete a session from the user_session table
 * @param {*} usid 
 * @param {*} env 
 * @returns 
 */
export async function deleteSession(usid, env) {
    try {
        const {results} = await env.DB.prepare("DELETE FROM user_session WHERE usid = ?").bind(usid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * deleteAllSessions - delete all of a user's session from the user_session table
 * @param {*} uid the user id
 * @param {*} env  
 * @returns 
 */
export async function deleteAllSessions(uid, env) {
    try {
        const {results} = await env.DB.prepare("DELETE FROM user_session WHERE uid = ?").bind(uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * renewSession - update the expiration date of a session in the user_session table
 * @param {*} usid 
 * @param {Date} expires_at 
 * @param {*} env 
 * @returns 
 */
export async function renewSession(usid, expires_at, env) {
    try {
        const {results} = await env.DB.prepare("UPDATE user_session SET expires_at = ? WHERE usid = ?").bind(expires_at, usid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * deleteExpiredSessions - delete all expired sessions from the user_session table
 * @param {*} env 
 * @returns 
 */
export async function deleteExpiredSessions(env) {
    try {
        const today = new Date().toISOString().slice(0, 10); // "2025-04-07"
        const {results} = await env.DB.prepare("DELETE FROM user_session WHERE expires_at < ?").bind(today).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * getUserPriv returns the user's privacy setting by the uid
 * @param {*} env the environment variables
 * @param {*} uid representing the user id
 * @returns results a json object containing int priv representing the user's privacy setting
 */
export async function getUserPriv(env, uid) {
    try {
        const {results} = await env.DB.prepare("SELECT FROM user_priv WHERE uid = ?").bind(uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * setUserPriv inserts a new user privacy setting into the database
 * @param {*} env the environment variables
 * @param {string} uid representing the user id
 * @param {int} priv representing the user's privacy setting
 */
export async function setUserPriv(env, uid, priv) {
    // if (priv !== 0 & priv !== 1) {
    //     throw new Error(`Bad Params`)
    // }
    try {
        const {results} = await env.DB.prepare("INSERT INTO user_priv (uid, priv) VALUES (?, ?)").bind(uid, priv).run();
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * updateUserPriv updates the user's privacy setting
 * @param {*} env the environment variable
 * @param {string} uid representing the user id
 * @param {int} priv representing the user's privacy setting
 */
export async function updateUserPriv(env, uid, priv){
    try {
        const {results} = await env.DB.prepare("UPDATE user_priv SET priv=? WHERE uid=?").bind(priv, uid).run();
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}