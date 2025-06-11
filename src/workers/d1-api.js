// D1-powered Cloudflare API worker
import { getUserByUid, getInfoByUid, getPasswordByUid, getPasswordByEmail, writeNewUser, writeNewPassword, addSession, getSession, getAllSessions, deleteSession, deleteAllSessions, renewSession, deleteExpiredSessions, addPost, getPostByID, getAllPostsFromUser, getAllPosts, editPost, deletePost, addComment, getComment, getParentPostByCommentID, getAllCommentsFromPost, getAllCommentsFromUser, editComment, deleteComment, addReaction, getReactionsByPostID, checkIfPostHasReactionFromUser, countReactionsByPostID, getAllReactionsFromUser, deleteReaction, getUserPriv, setUserPriv, updateUserPriv, updateFname, updateLname, updateDOB, updateEmail, updateHashpass, deleteUser, newGroup, newGroupMember } from './d1-func.js';

/**
 * addCorsHeaders - add CORS headers to the response
 * @param {response} response 
 * @returns 
 */
function addCorsHeaders(response) {
    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", "https://peppy-nougat-0120f1.netlify.app/");
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return new Response(response.body, { ...response, headers });
}

/**
 * fetch - handle the incoming request
 * @param {request} request
 * @param {env} env
 * @returns response
 */
export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Handle preflight OPTIONS requests
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "https://peppy-nougat-0120f1.netlify.app/",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    "Access-Control-Max-Age": "86400", // Cache preflight for 24 hours
                },
            });
        }

        // passed in keys
        const auth = url.searchParams.get("auth");
        const wauth = url.searchParams.get("wauth");
        const aauth = url.searchParams.get("aauth");
        const sauth = url.searchParams.get("sauth");
        const pauth = url.searchParams.get("pauth");

        if (!auth && !wauth && !aauth && !sauth && !pauth) {
            return addCorsHeaders(new Response("Unauthorized", { status: 401 }));
        }

        /* POST API */

        // create a new post
        if (url.pathname === "/post/create") {
            const pid = url.searchParams.get("pid");
            const caption = url.searchParams.get("caption");
            const imageUrl = url.searchParams.get("url");
            const uid = url.searchParams.get("uid");

            console.log("Creating post with:", { pid, caption, imageUrl, uid });


            try {
                const response = await addPost(pid, caption, imageUrl, uid, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // edit a post
        if (url.pathname === "/post/edit") {
            const pid = url.searchParams.get("pid");
            const caption = url.searchParams.get("caption");
            const uid = url.searchParams.get("uid");

            try {
                const response = await editPost(pid, uid, caption, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // delete a post
        if (url.pathname === "/post/delete") {
            const pid = url.searchParams.get("pid");
            const uid = url.searchParams.get("uid");

            try {
                const response = await deletePost(pid, uid, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // get a post by post id
        if (url.pathname === "/post/get/p") {
            const pid = url.searchParams.get("pid");

            try {
                const response = await getPostByID(pid, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // get all posts from user
        if (url.pathname === "/post/get/u") {
            const uid = url.searchParams.get("uid");

            try {
                const response = await getAllPostsFromUser(uid, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // get all posts
        if (url.pathname === "/posts/get/a") {
            try {
                const response = await getAllPosts(env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // add a comment
        if (url.pathname === "/comment/create") {
            const cid = url.searchParams.get("cid");
            const caption = url.searchParams.get("caption");
            const uid = url.searchParams.get("uid");
            const pid = url.searchParams.get("pid");

            try {
                const response = await addComment(cid, caption, uid, pid, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // get a comment by cid
        if (url.pathname === "/comment/get/c") {
            const cid = url.searchParams.get("cid");

            try {
                const response = await getComment(cid, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // get the parent post of a comment
        if (url.pathname === "/comment/get/c/parent") {
            const cid = url.searchParams.get("cid");

            try {
                const response = await getParentPostByCommentID(cid, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // get all comments on a post
        if (url.pathname === "/comment/get/p/all") {
            const pid = url.searchParams.get("pid");

            try {
                const response = await getAllCommentsFromPost(pid, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // get all comments from a user
        if (url.pathname === "/comment/get/u/all") {
            const uid = url.searchParams.get("uid");

            try {
                const response = await getAllCommentsFromUser(uid, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // edit a comment
        if (url.pathname === "/comment/edit") {
            const cid = url.searchParams.get("cid");
            const uid = url.searchParams.get("uid");
            const content = url.searchParams.get("content");

            try {
                const response = await editComment(cid, uid, content, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // delete a comment
        if (url.pathname === "/comment/delete") {
            const cid = url.searchParams.get("cid");
            const uid = url.searchParams.get("uid");

            try {
                const response = await deleteComment(cid, uid, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // add a reaction to a post
        if (url.pathname === "/reaction/add") {
            const rid = url.searchParams.get("rid");
            const uid = url.searchParams.get("uid");
            const pid = url.searchParams.get("pid");

            try {
                const response = await addReaction(rid, uid, pid, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // remove a reaction from a post
        if (url.pathname === "/reaction/remove") {
            const uid = url.searchParams.get("uid");
            const pid = url.searchParams.get("pid");

            try {
                const response = await deleteReaction(uid, pid, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // aggregate reactions from a post
        if (url.pathname === "/reaction/aggregate") {
            const pid = url.searchParams.get("pid");

            try {
                const response = await countReactionsByPostID(pid, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // check if a reaction exists
        if (url.pathname === "/reaction/exists") {
            const uid = url.searchParams.get("uid");
            const pid = url.searchParams.get("pid");

            try {
                const response = await checkIfPostHasReactionFromUser(uid, pid, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        /* GROUP API */

        // create a new group
        if (url.pathname === "/groups/new") {
            const gid = url.searchParams.get("gid");
            const gname = url.searchParams.get("gname");
            const priv = url.searchParams.get("priv");

            try {
                const response = await newGroup(gid, gname, priv, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // create a new group member
        if (url.pathname === "/groups/member/new") {
            const gmid = url.searchParams.get("gmid");
            const uid = url.searchParams.get("uid");
            const gid = url.searchParams.get("gid");
            const role_g = url.searchParams.get("role_g");
            const priv = url.searchParams.get("priv");

            try {
                const response = await newGroupMember(gmid, uid, gid, role_g, priv, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        /* SESSION API */

        // create a new session
        if (url.pathname === "/sessions/new") {
            if (!sauth || sauth !== env.USR_SESSION) {
                return addCorsHeaders(new Response("Unauthorized", { status: 401 }));
            }
            // add a new session

            // get the session params from the querystring
            const usid = url.searchParams.get("usid");
            const uid = url.searchParams.get("uid");
            const expires_at = url.searchParams.get("expires_at");

            // check for the session params
            if (!usid || !uid || !expires_at) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "bad params" }), { status: 400 }));
            }

            try {
                const response = await addSession(usid, uid, expires_at, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // get session
        if (url.pathname === "/sessions/get") {
            if (!sauth || sauth !== env.USR_SESSION) {
                return addCorsHeaders(new Response("Unauthorized", { status: 401 }));
            }
            // add a new session

            // get the session params from the querystring
            const usid = url.searchParams.get("usid");
            const uid = url.searchParams.get("uid");

            // check for the session params
            if (!usid && !uid) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "bad params" }), { status: 400 }));
            } else if (!usid) {
                // get all sessions
                try {
                    const response = await getAllSessions(uid, env);
                    return addCorsHeaders(new Response(JSON.stringify(response), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    }));
                }
                catch (err) {
                    return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
                }
            }
            // get a single session
            try {
                const response = await getSession(usid, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // delete session
        if (url.pathname === "/sessions/delete") {
            if (!sauth || sauth !== env.USR_SESSION) {
                return addCorsHeaders(new Response("Unauthorized", { status: 401 }));
            }
            // add a new session

            // get the session params from the querystring
            const usid = url.searchParams.get("usid");
            const uid = url.searchParams.get("uid");

            // check for the session params
            if (!usid && !uid) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "bad params" }), { status: 400 }));
            } else if (!usid) {
                // delete all sessions
                try {
                    const response = await deleteAllSessions(uid, env);
                    return addCorsHeaders(new Response(JSON.stringify(response), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    }));
                }
                catch (err) {
                    return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
                }
            }
            // delete a single session
            try {
                const response = await deleteSession(usid, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // renew session
        if (url.pathname === "/sessions/renew") {
            if (!sauth || sauth !== env.USR_SESSION) {
                return addCorsHeaders(new Response("Unauthorized", { status: 401 }));
            }
            // add a new session

            // get the session params from the querystring
            const usid = url.searchParams.get("usid");
            const expires_at = url.searchParams.get("expires_at");

            // check for the session params
            if (!usid || !expires_at) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "bad params" }), { status: 400 }));
            }

            try {
                const response = await renewSession(usid, expires_at, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // delete expired sessions
        if (url.pathname === "/sessions/stale") {
            if (!sauth || sauth !== env.USR_SESSION) {
                return addCorsHeaders(new Response("Unauthorized", { status: 401 }));
            }
            // add a new session

            try {
                const response = await deleteExpiredSessions(env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // check for the read key
        if (!auth || auth !== env.USR_DB) {
            return addCorsHeaders(new Response("Unauthorized", { status: 401 }));
        }

        // api/admin
        if (url.pathname === "/api/admin") {
            const uid = url.searchParams.get("uid");
            if (!uid) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "UID is required" }), { status: 400 }));
            }

            try {
                const user = await getUserByUid(uid, env);

                if (user.length === 0) {
                    return addCorsHeaders(new Response(JSON.stringify({ error: "User not found" }), { status: 404 }));
                }

                return addCorsHeaders(new Response(JSON.stringify(user), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // api/info
        if (url.pathname === "/api/info") {
            const uid = url.searchParams.get("uid");
            if (!uid) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "UID is required" }), { status: 400 }));
            }

            try {
                const user = await getInfoByUid(uid, env);

                if (user.length === 0) {
                    return addCorsHeaders(new Response(JSON.stringify({ error: "User not found" }), { status: 404 }));
                }

                return addCorsHeaders(new Response(JSON.stringify(user), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // api/password
        if (url.pathname === "/api/password") {
            const uid = url.searchParams.get("uid");
            const email = url.searchParams.get("email");

            if (!uid) {
                if (!email) {
                    return addCorsHeaders(new Response(JSON.stringify({ error: "UID or email is required" }), { status: 400 }));
                }

                try {
                    const hashpass = await getPasswordByEmail(email, env);

                    if (hashpass.length === 0) {
                        return addCorsHeaders(new Response(JSON.stringify({ error: "User not found" }), { status: 404 }));
                    }

                    return addCorsHeaders(new Response(JSON.stringify(hashpass), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    }));
                } catch (err) {
                    return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
                }
            }

            try {
                const hashpass = await getPasswordByUid(uid, env);

                if (hashpass.length === 0) {
                    return addCorsHeaders(new Response(JSON.stringify({ error: "User not found" }), { status: 404 }));
                }

                return addCorsHeaders(new Response(JSON.stringify(hashpass), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // api/priv/get
        if (url.pathname === "/api/priv/get") {
            const uid = url.searchParams.get("uid");

            if (!uid) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "bad params" }), { status: 400 }));
            }

            try {
                const response = await getUserPriv(env, uid);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // check for the write key
        if (!wauth || wauth !== env.USR_DB_W) {
            return addCorsHeaders(new Response("Unauthorized", { status: 401 }));
        }

        /** 
         * api/edit/info 
         * routine for editing the user info
         */
        if (url.pathname === "/api/edit/info") {
            const uid = url.searchParams.get("uid");
            const fname = url.searchParams.get("fname");
            const lname = url.searchParams.get("lname");
            const dob = url.searchParams.get("dob");
            const email = url.searchParams.get("email");
            const hashpass = url.searchParams.get("hashpass");

            if (!uid || (!fname && !lname && !dob && !email && !hashpass)) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "bad params" }), { status: 400 }));
            }

            const results = [];

            try {
                if (fname) results.push(await updateFname(uid, fname, env));
                if (lname) results.push(await updateLname(uid, lname, env));
                if (dob) results.push(await updateDOB(uid, dob, env));
                if (email) results.push(await updateEmail(uid, email, env));
                if (hashpass) results.push(await updateHashpass(uid, hashpass, env));
            } catch (err) {
                return addCorsHeaders(
                    new Response(JSON.stringify({ error: err.message }), { status: 500 })
                );
            }

            return addCorsHeaders(
                new Response(JSON.stringify({ message: "Update(s) successful", results }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                })
            );
        }

        /* api to handle the privacy setting */

        // api/priv/update
        if (url.pathname === "/api/priv/update") {
            const uid = url.searchParams.get("uid");
            const priv = url.searchParams.get("priv");

            if (!uid || !priv) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "bad params" }), { status: 400 }));
            }

            try {
                const response = await updateUserPriv(env, uid, priv);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // api/priv/init
        if (url.pathname === "/api/priv/init") {
            const uid = url.searchParams.get("uid");

            if (!uid) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "bad params" }), { status: 400 }));
            }

            const priv = 0; // default privacy is public

            try {
                const response = await setUserPriv(env, uid, priv);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        /* API to handle the info table */

        // api/write/info
        if (url.pathname === "/api/write/info") {
            const uid = url.searchParams.get("uid");
            const fname = url.searchParams.get("fname");
            const lname = url.searchParams.get("lname");
            const dob = url.searchParams.get("dob");
            const doj = url.searchParams.get("doj");
            if (!uid || !fname || !lname || !dob || !doj) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "bad params" }), { status: 400 }));
            }

            try {
                const response = await writeNewUser(uid, fname, lname, dob, doj, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            }
            catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // check for the admin key
        if (!aauth || aauth !== env.USR_DB_W_ADMIN) {
            return addCorsHeaders(new Response("Unauthorized", { status: 401 }));
        }

        // api/write/admin
        if (url.pathname === "/api/write/admin") {
            const uid = url.searchParams.get("uid");
            const email = url.searchParams.get("email");
            const hashpass = url.searchParams.get("hashpass");
            if (!uid || !email || !hashpass) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "bad params" }), { status: 400 }));
            }

            try {
                const response = await writeNewPassword(uid, email, hashpass, env);
                return addCorsHeaders(new Response(JSON.stringify(response), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }));
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        // api/deleteuser - worker implementation of d1-func.deleteUser()
        if (url.pathname === "/api/deleteuser") {
            const uid = url.searchParams.get("uid");
            const hashpass = url.searchParams.get("hashpass");
            if (!uid || !hashpass) {
                return addCorsHeaders(new Response(JSON.stringify({ error: "bad params" }), { status: 400 }));
            }

            try {
                const deletedCount = await deleteUser(uid, hashpass, env);

                if (deletedCount > 0) {
                    // Optional: delete sessions here
                    return new Response(JSON.stringify({ success: true }), { status: 200 });
                } else {
                    return new Response(JSON.stringify({ error: "Invalid credentials or user not found" }), { status: 401 });
                }
            } catch (err) {
                return addCorsHeaders(new Response(JSON.stringify({ error: err.message }), { status: 500 }));
            }
        }

        return addCorsHeaders(new Response("Not found", { status: 404 }));
    },
};