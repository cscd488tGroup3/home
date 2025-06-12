/**
 * This file contains the functions used in `d1-api.js` to interact with the database in perscribed ways
 */

/* INFO, ADMIN DATABASE FUNCTIONS */

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
        const { results } = await env.DB.prepare("INSERT INTO info (uid, fname, lname, dob, doj) VALUES (?, ?, ?, ?, ?);").bind(uid, fname, lname, dob, doj).run();
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
        const { results } = await env.DB.prepare("INSERT INTO admin (uid, email, hashpass) VALUES (?, ?, ?);").bind(uid, email, hashpass).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * deletUser - removes a user from the database based on the user id
 *             deletion of all user data cascades from the deletion of 
 *             the user from the admin table.
 * @param {String} uid representing the username of the account to be deleted 
 * @param {*} env 
 * @returns status message of the database
 */
export async function deleteUser(uid, hashpass, env) {
    try {
        const result = await env.DB.prepare(
            "DELETE FROM admin WHERE uid = ? AND hashpass = ?"
        )
            .bind(uid, hashpass)
            .run();

        return result.meta?.changes ?? 0; // This is what you want
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}


/* SESSION DATABASE FUNCTIONS */

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
        const { results } = await env.DB.prepare("INSERT INTO user_session (usid, uid, expires_at) VALUES (?, ?, ?);").bind(usid, uid, expires_at).run();
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
        const { results } = await env.DB.prepare("SELECT * FROM user_session WHERE usid = ?").bind(usid).all();
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
        const { results } = await env.DB.prepare("SELECT * FROM user_session WHERE uid = ?").bind(uid).all();
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
        const { results } = await env.DB.prepare("DELETE FROM user_session WHERE usid = ?").bind(usid).run();
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
        const { results } = await env.DB.prepare("DELETE FROM user_session WHERE uid = ?").bind(uid).run();
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
        const { results } = await env.DB.prepare("UPDATE user_session SET expires_at = ? WHERE usid = ?").bind(expires_at, usid).run();
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
        const { results } = await env.DB.prepare("DELETE FROM user_session WHERE expires_at < ?").bind(today).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/* POST, COMMENTS, REACTON DATABASE FUNCTIONS */

/**
 * addPost - insert a new post into the posts table
 * @param {String} pid represents the post id
 * @param {String} caption represents the post caption
 * @param {String} url represents the url to the image 
 * @param {String} uid represents the user id
 * @param {*} env represents the environment variable
 * @returns json data response
 */
export async function addPost(pid, caption, url, uid, env) {
    try {
        const { results } = await env.DB.prepare("INSERT INTO post (pid, caption, url, uid) VALUES (?, ?, ?, ?);").bind(pid, caption, url, uid).run();
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
export async function getPostByID(pid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM post WHERE id = ?").bind(pid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * getAllPostsFromUser - query the posts table for all posts by a particular user
 * @param {*} uid 
 * @param {*} env 
 * @returns json data response
 */
export async function getAllPostsFromUser(uid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM post WHERE uid = ?").bind(uid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * 
 * @param {*} env 
 * @returns 
 */
export async function getAllPosts(env) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM post").all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * editPost - update the caption of a post in the posts table
 * @param {*} pid 
 * @param {*} uid 
 * @param {*} newCaption 
 * @param {*} env 
 * @returns json data response
 */
export async function editPost(pid, uid, newCaption, env) {
    try {
        const { results } = await env.DB.prepare("UPDATE post SET caption = ? WHERE pid = ? AND uid = ?").bind(newCaption, pid, uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * deletePost - delete a post from the posts table
 * @param {*} pid 
 * @param {*} uid 
 * @param {*} env 
 * @returns json data response
 */
export async function deletePost(pid, uid, env) {
    try {
        const { results } = await env.DB.prepare("DELETE FROM post WHERE pid = ? AND uid = ?").bind(pid, uid).run();
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
 * @param {*} pid 
 * @param {*} env 
 * @returns json data response
 */
export async function addComment(cid, content, uid, pid, env) {
    try {
        const { results } = await env.DB.prepare("INSERT INTO comment (cid, content, uid, pid) VALUES (?, ?, ?, ?);").bind(cid, content, uid, pid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * getComment - query the comments table for the comment id
 * @param {*} cid 
 * @param {*} env 
 * @returns json data response
 */
export async function getComment(cid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM comment WHERE cid = ?").bind(cid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * getParentPostByCommentID - query the posts table for the post id of a comment
 * @param {*} cid 
 * @param {*} env 
 * @returns json data response
 */
export async function getParentPostByCommentID(cid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM post WHERE pid = (SELECT pid FROM comment WHERE cid = ?)").bind(cid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * getAllCommentsFromPost - query the comments table for all comments to a particular post
 * @param {*} id 
 * @param {*} env 
 * @returns json data response
 */
export async function getAllCommentsFromPost(pid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM comment WHERE pid = ?").bind(pid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * getAllCommentsFromUser - query the comments table for all comments by a particular user
 * @param {*} uid 
 * @param {*} env 
 * @returns json data response
 */
export async function getAllCommentsFromUser(uid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM comment WHERE uid = ?").bind(uid).all();
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
 * @returns json data response
 */
export async function editComment(cid, uid, newContent, env) {
    try {
        const { results } = await env.DB.prepare("UPDATE comment SET content = ? WHERE cid = ? AND uid = ?").bind(newContent, cid, uid).run();
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
 * @returns json data response
 */
export async function deleteComment(cid, uid, env) {
    try {
        const { results } = await env.DB.prepare("DELETE FROM comment WHERE cid = ? AND uid = ?").bind(cid, uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * addReaction - insert a new reaction into the reaction table
 * @param {*} rid 
 * @param {*} uid 
 * @param {*} pid 
 * @param {*} env 
 * @returns json data response
 */
export async function addReaction(rid, uid, pid, env) {
    try {
        const { results } = await env.DB.prepare("INSERT INTO reaction (rid, uid, pid) VALUES (?, ?, ?);").bind(rid, uid, pid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * getReactionByPostID - query the reaction table for the reaction ids of the reactions to a post
 * @param {*} pid 
 * @param {*} env 
 * @returns json data response
 */
export async function getReactionsByPostID(pid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM reaction WHERE id = ?").bind(pid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * countReactionsByPostID - query the reaction table for the number of reactions to a post
 * @param {*} pid 
 * @param {*} env 
 * @returns json data response
 */
export async function countReactionsByPostID(pid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT COUNT(*) AS count FROM reaction WHERE pid = ?")
            .bind(pid)
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
 * @returns json data response
 */
export async function getAllReactionsFromUser(uid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM reaction WHERE uid = ?").bind(uid).all();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}
/**
 * deleteReaction - delete a reaction from the reaction table
 * @param {String} uid 
 * @param {String} pid 
 * @param {*} env 
 * @returns json data response
 */
export async function deleteReaction(uid, pid, env) {
    try {
        const { results } = await env.DB.prepare("DELETE FROM reaction WHERE pid = ? AND uid = ?").bind(pid, uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * checkIfPostHasReactionFromUser - check if a post has a reaction from
 * a user
 * @param {*} pid 
 * @param {*} uid 
 * @param {*} env 
 * @returns 
 */
export async function checkIfPostHasReactionFromUser(uid, pid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT rid FROM reaction WHERE uid = ? AND pid = ?").bind(uid, pid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

// USER PRIV DATABASE FUNCTIONS //

/**
 * getUserPriv returns the user's privacy setting by the uid
 * @param {*} env the environment variables
 * @param {*} uid representing the user id
 * @returns results a json object containing int priv representing the user's privacy setting
 */
export async function getUserPriv(env, uid) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM user_priv WHERE uid = ?").bind(uid).run();
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
        const { results } = await env.DB.prepare("INSERT INTO user_priv (uid, priv) VALUES (?, ?)").bind(uid, priv).run();
        return results;
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
export async function updateUserPriv(env, uid, priv) {
    try {
        const { results } = await env.DB.prepare("UPDATE user_priv SET priv=? WHERE uid=?").bind(priv, uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/* UPDATE USER INFO FUNCTIONS */

/**
 * updateFname updates fname in the info table
 * @param {*} uid representing the user id
 * @param {*} fname representing the user's first name
 * @param {*} env representing the environment variables
 * @returns 
 */
export async function updateFname(uid, fname, env) {
    try {
        const { results } = await env.DB.prepare("UPDATE info SET fname = ? WHERE uid = ?").bind(fname, uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * updateLname updates lname in the info table
 * @param {*} uid representing the user id
 * @param {*} lname representing the user's last name
 * @param {*} env representing the environment variable
 * @returns 
 */
export async function updateLname(uid, lname, env) {
    try {
        const { results } = await env.DB.prepare("UPDATE info SET lname = ? WHERE uid = ?").bind(lname, uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * updateDOB updates dob in the info table
 * @param {*} uid representing the user id
 * @param {*} dob representing the user's date of birth
 * @param {*} env representing the environment variable
 * @returns 
 */
export async function updateDOB(uid, dob, env) {
    try {
        const { results } = await env.DB.prepare("UPDATE info SET dob = ? WHERE uid = ?").bind(dob, uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * updateEmail updates email in the admin table
 * @param {*} uid representing the user id
 * @param {*} email representing the user's email
 * @param {*} env representing the environment variable
 * @returns 
 */
export async function updateEmail(uid, email, env) {
    try {
        const { results } = await env.DB.prepare("UPDATE admin SET email = ? WHERE uid = ?").bind(email, uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * updateHashpass updates hashpass in the admin table
 * @param {*} uid representing the user id
 * @param {*} hashpass representing the user's hashed password
 * @param {*} env representing the environment variable
 * @returns 
 */
export async function updateHashpass(uid, hashpass, env) {
    try {
        const { results } = await env.DB.prepare("UPDATE admin SET hashpass = ? WHERE uid = ?").bind(hashpass, uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/* GROUP DATABASE FUNCTIONS */
/**
 * 
 * @param {*} gid 
 * @param {*} gname 
 * @param {*} priv 
 * @param {*} env 
 * @returns 
 */
export async function newGroup(gid, gname, priv, env) {
    try {
        const { results } = await env.DB.prepare("INSERT INTO group_g (gid, gname, priv) VALUES (?, ?, ?)").bind(gid, gname, priv).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * 
 * @param {*} gid 
 * @param {*} env 
 * @returns 
 */
export async function getGroupName(gid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT gname FROM group_g WHERE gid = ?").bind(priv, gid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * 
 * @param {*} gid 
 * @param {*} priv 
 * @param {*} env 
 * @returns 
 */
export async function editGroupPriv(gid, priv, env) {
    try {
        const { results } = await env.DB.prepare("UPDATE group_g SET priv = ? WHERE gid = ?").bind(priv, gid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * 
 * @param {*} gid 
 * @param {*} gname 
 * @param {*} env 
 * @returns 
 */
export async function editGroupName(gid, gname, env) {
    try {
        const { results } = await env.DB.prepare("UPDATE group_g SET gname = ? WHERE gid = ?").bind(gname, gid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * 
 * @param {string} gid 
 * @param {*} env
 * @returns 
 */
export async function deleteGroup(gid, env) {
    try {
        const { results } = await env.DB.prepare("DELETE FROM group_g WHERE gid = ?").bind(gid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * 
 * @param {String} gmid 
 * @param {String} uid 
 * @param {String} gid 
 * @param {int} role_g 
 * @param {int} priv 
 * @param {*} env 
 */
export async function newGroupMember(gmid, uid, gid, role_g, priv, env) {
    try {
        const { results } = await env.DB.prepare("INSERT INTO group_member (gmid, uid, gid, role_g, priv) VALUES (?, ?, ?, ?, ?)").bind(gmid, uid, gid, role_g, priv).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * 
 * @param {String} gid 
 * @param {*} env 
 * @returns 
 */
export async function getGroupInfo(gid, env) {
    try {
        const { results } = await env.DB.prepare("SELECT * FROM group_g WHERE gid = ?").bind(gid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * 
 * @param {*} uid 
 * @param {*} env 
 */
export async function getGroupMembership(uid, env) {
    try {
    const { results } = await env.DB.prepare("SELECT gm.gid, g.gname FROM group_member gm INNER JOIN group_g g ON gm.gid = g.gid WHERE gm.uid = ?").bind(uid).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/**
 * 
 * @param {*} gid 
 * @param {*} role_g 
 * @param {*} env 
 */
export async function getGroupMembersByRole(gid, role_g, env) {
    try {
    const { results } = await env.DB.prepare("SELECT gm.uid, u.fname, u.lname FROM group_member gm INNER JOIN info u ON gm.uid = u.uid WHERE gm.gid = ? AND gm.role_g = ?").bind(gid, role_g).run();
        return results;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
}

/*  */
