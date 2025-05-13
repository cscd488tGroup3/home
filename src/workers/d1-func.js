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
// ALL OF THIS IS NEW FOR THE NEXT SPRINT //

/**
 * addPost - insert a new post into the posts table
 * @param {String} id represents the post id
 * @param {String} caption represents the post caption
 * @param {String} url represents the url to the image 
 * @param {String} uid represents the user id
 * @param {*} env 
 * @returns 
 */
export async function addPost(id, caption, url, uid, env) { 
    try {
        const {results} = await env.DB.prepare("INSERT INTO post (id, caption, url, uid) VALUES (?, ?, ?, ?);").bind(id, caption, url, uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * getPostByID - query the posts table for the post id
 * @param {*} id 
 * @param {*} env 
 * @returns 
 */
export async function getPostByID(id, env) { 
    try {
        const {results} = await env.DB.prepare("SELECT * FROM post WHERE id = ?").bind(id).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * getAllPostsFromUser - query the posts table for all posts by a particular user
 * @param {*} uid 
 * @param {*} env 
 * @returns 
 */
export async function getAllPostsFromUser(uid, env) {
    try {
        const {results} = await env.DB.prepare("SELECT * FROM post WHERE uid = ?").bind(uid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * editPost - update the caption of a post in the posts table
 * @param {*} id 
 * @param {*} uid 
 * @param {*} newCaption 
 * @param {*} env 
 * @returns 
 */
export async function editPost(id, uid, newCaption, env) { 
    try {
        const {results} = await env.DB.prepare("UPDATE post SET caption = ? WHERE id = ? AND uid = ?").bind(newCaption, id, uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * deletePost - delete a post from the posts table
 * @param {*} id 
 * @param {*} uid 
 * @param {*} env 
 * @returns 
 */
export async function deletePost(id, uid, env) { 
    try {
        const {results} = await env.DB.prepare("DELETE FROM post WHERE id = ? AND uid = ?").bind(id, uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * addComment - insert a new comment into the comments table
 * @param {*} cid 
 * @param {*} content 
 * @param {*} uid 
 * @param {*} id 
 * @param {*} env 
 * @returns 
 */
export async function addComment(cid, content, uid, id, env) { 
    try {
        const {results} = await env.DB.prepare("INSERT INTO comment (cid, content, uid, id) VALUES (?, ?, ?, ?);").bind(cid, content, uid, id).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * getComment - query the comments table for the comment id
 * @param {*} cid 
 * @param {*} env 
 * @returns 
 */
export async function getComment(cid, env) {
    try {
        const {results} = await env.DB.prepare("SELECT * FROM comment WHERE cid = ?").bind(cid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * getParentPostByCommentID - query the posts table for the post id of a comment
 * @param {*} cid 
 * @param {*} env 
 * @returns 
 */
export async function getParentPostByCommentID(cid, env) {
    try {
        const {results} = await env.DB.prepare("SELECT * FROM post WHERE id = (SELECT id FROM comment WHERE cid = ?)").bind(cid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * getAllCommentsFromPost - query the comments table for all comments to a particular post
 * @param {*} id 
 * @param {*} env 
 * @returns 
 */
export async function getAllCommentsFromPost(id, env) {
    try {
        const {results} = await env.DB.prepare("SELECT * FROM comment WHERE id = ?").bind(id).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * getAllCommentsFromUser - query the comments table for all comments by a particular user
 * @param {*} uid 
 * @param {*} env 
 * @returns 
 */
export async function getAllCommentsFromUser(uid, env) {
    try {
        const {results} = await env.DB.prepare("SELECT * FROM comment WHERE uid = ?").bind(uid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * editComment - update the content of a comment in the comments table
 * @param {*} cid 
 * @param {*} uid 
 * @param {*} newContent 
 * @param {*} env 
 * @returns 
 */
export async function editComment(cid, uid, newContent, env) { 
    try {
        const {results} = await env.DB.prepare("UPDATE comment SET content = ? WHERE cid = ? AND uid = ?").bind(newContent, cid, uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * deleteComment - delete a comment from the comments table
 * @param {*} cid 
 * @param {*} uid 
 * @param {*} env 
 * @returns 
 */
export async function deleteComment(cid, uid, env) { 
    try {
        const {results} = await env.DB.prepare("DELETE FROM comment WHERE cid = ? AND uid = ?").bind(cid, uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * addReaction - insert a new reaction into the reaction table
 * @param {*} rid 
 * @param {*} uid 
 * @param {*} id 
 * @param {*} env 
 * @returns 
 */
export async function addReaction(rid, uid, id, env) {
    try {
        const {results} = await env.DB.prepare("INSERT INTO reaction (rid, uid, id) VALUES (?, ?, ?);").bind(rid, uid, id).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * getReactionByPostID - query the reaction table for the reaction ids of the reactions to a post
 * @param {*} id 
 * @param {*} env 
 * @returns 
 */
export async function getReactionsByPostID(id, env) {
    try {
        const {results} = await env.DB.prepare("SELECT * FROM reaction WHERE id = ?").bind(id).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * countReactionsByPostID - query the reaction table for the number of reactions to a post
 * @param {*} id 
 * @param {*} env 
 * @returns 
 */
export async function countReactionsByPostID(id, env) {
    try {
        const { results } = await env.DB.prepare("SELECT COUNT(*) AS count FROM reaction WHERE id = ?")
            .bind(id)
            .all();
        return results[0]?.count ?? 0; // Return the count or 0 if no rows
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * getAllReactionsFromUser - query the reaction table for all reactions by a particular user
 * @param {*} uid 
 * @param {*} env 
 * @returns 
 */
export async function getAllReactionsFromUser(uid, env) {
    try {
        const {results} = await env.DB.prepare("SELECT * FROM reaction WHERE uid = ?").bind(uid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * deleteReaction - delete a reaction from the reaction table
 * @param {String} rid 
 * @param {String} uid 
 * @param {*} env 
 * @returns 
 */
export async function deleteReaction(rid, uid, env) { 
    try {
        const {results} = await env.DB.prepare("DELETE FROM reaction WHERE rid = ? AND uid = ?").bind(rid, uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

// USER PRIV DATABASE ADAPTER //

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
