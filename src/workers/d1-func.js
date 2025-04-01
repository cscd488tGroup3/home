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
 * @param {*} uid 
 * @param {*} email 
 * @param {*} fname 
 * @param {*} lname 
 * @param {*} dob 
 * @param {*} doj 
 * @param {*} env 
 * @returns status message of the database
 */
export async function writeNewUser(uid, email, fname, lname, dob, doj, env) {
    try {
        const {results} = await env.DB.prepare("INSERT INTO info (uid, email, fname, lname, dob, doj) VALUES (?, ?, ?, ?, ?, ?);").bind(uid, email, fname, lname, dob, doj).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * writeNewPassword - insert a new user into the admin table
 * @param {*} uid 
 * @param {*} email 
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
