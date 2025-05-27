import { savePosts, getSavedPosts } from './storage.js';
import { renderPost } from './postManager.js';

export function setupFormHandlers() {
    const imageInput = document.getElementById('images');
    const fileLabel = document.getElementById('fileLabel');
    const captionInput = document.getElementById('caption');
    const captionCounter = document.getElementById('captionCounter');
    const postForm = document.getElementById('postForm');
    const toggleFormButton = document.getElementById('toggleFormButton');
    const postContainer = document.getElementById('postContainer');

    imageInput.addEventListener('change', () => {
        fileLabel.textContent = imageInput.files.length > 0
            ? `Chosen File: ${imageInput.files[0].name}`
            : "Choose File";
    });

    captionInput.addEventListener('input', () => {
        const len = captionInput.value.length;
        captionCounter.textContent = `${len}/200`;
        captionCounter.style.color = len > 200 ? 'red' : 'black';
    });

    toggleFormButton.addEventListener('click', () => {
        const visible = postForm.style.display !== 'none';
        postForm.style.display = visible ? 'none' : 'block';
        toggleFormButton.textContent = visible ? 'Create Post' : 'Hide Form';
    });

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (imageInput.files.length === 0) return alert('Please select an image.');
        if (captionInput.value.length > 200) return alert('Caption cannot exceed 200 characters.');

        const reader = new FileReader();
        reader.onload = (event) => {
            const post = {
                pid: crypto.randomUUID(),
                caption: captionInput.value.trim(),
                url: event.target.result, // Use Cloudinary URL in real app
                uid: "YourUID",
                comments: [],
                reaction: null
            };

            const posts = getSavedPosts();
            posts.push(post);
            savePosts(posts);
            renderPost(post);
        };
        reader.readAsDataURL(imageInput.files[0]);

        postForm.reset();
        captionCounter.textContent = '0/200';
        imageInput.value = "";
        fileLabel.textContent = "Choose File";
        postForm.style.display = 'none';
        toggleFormButton.textContent = 'Create Post';
    });
}

export function renderSavedPosts() {
    const posts = getSavedPosts();
    posts.forEach(renderPost);
}
