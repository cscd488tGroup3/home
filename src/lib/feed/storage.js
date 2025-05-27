export function getSavedPosts() {
    try {
        return JSON.parse(localStorage.getItem('posts')) || [];
    } catch {
        return [];
    }
}

export function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

export function generateUUID() {
    return crypto.randomUUID(); // requires modern browsers
}
