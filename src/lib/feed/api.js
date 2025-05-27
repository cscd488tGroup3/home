const BASE_URL = "https://your-api-domain.com"; // replace with actual endpoint

export async function createPost(pid, caption, url, uid) {
    const response = await fetch(`${BASE_URL}/post/create?pid=${pid}&caption=${encodeURIComponent(caption)}&url=${url}&uid=${uid}`);
    return await response.json();
}

export async function editPost(pid, caption, uid) {
    const response = await fetch(`${BASE_URL}/post/edit?pid=${pid}&caption=${encodeURIComponent(caption)}&uid=${uid}`);
    return await response.json();
}

export async function deletePost(pid, uid) {
    const response = await fetch(`${BASE_URL}/post/delete?pid=${pid}&uid=${uid}`);
    return await response.json();
}

export async function getPostById(pid) {
    const response = await fetch(`${BASE_URL}/post/get/p?pid=${pid}`);
    return await response.json();
}

export async function getAllPostsFromUser(uid) {
    const response = await fetch(`${BASE_URL}/post/get/u?uid=${uid}`);
    return await response.json();
}

export async function createComment(cid, caption, uid, pid) {
    const response = await fetch(`${BASE_URL}/comment/create?cid=${cid}&caption=${encodeURIComponent(caption)}&uid=${uid}&pid=${pid}`);
    return await response.json();
}

export async function editComment(cid, uid, content) {
    const response = await fetch(`${BASE_URL}/comment/edit?cid=${cid}&uid=${uid}&content=${encodeURIComponent(content)}`);
    return await response.json();
}

export async function deleteComment(cid, uid) {
    const response = await fetch(`${BASE_URL}/comment/delete?cid=${cid}&uid=${uid}`);
    return await response.json();
}

export async function getCommentById(cid) {
    const response = await fetch(`${BASE_URL}/comment/get/c?cid=${cid}`);
    return await response.json();
}

export async function getParentPostByCommentID(cid) {
    const response = await fetch(`${BASE_URL}/comment/get/c/parent?cid=${cid}`);
    return await response.json();
}

export async function getAllCommentsFromPost(pid) {
    const response = await fetch(`${BASE_URL}/comment/get/p/all?pid=${pid}`);
    return await response.json();
}

export async function getAllCommentsFromUser(uid) {
    const response = await fetch(`${BASE_URL}/comment/get/u/all?uid=${uid}`);
    return await response.json();
}
