import { generateUUID } from './storage.js';
import {
    editPost,
    deletePost,
    createComment,
    editComment,
    deleteComment,
    getAllCommentsFromPost
} from './api.js';

export async function renderPost(postData, uid) {
    const { pid, caption, url, comments, reaction } = postData;
    const container = document.getElementById('postContainer');

    const post = document.createElement('div');
    post.classList.add('post');
    post.innerHTML = `
        <div class="menu-container">
            <button class="menu-button">⋮</button>
            <div class="menu-options hidden">
                <button class="edit-caption">Edit</button>
                <button class="confirm-delete">Delete</button>
            </div>
        </div>
        <div class="image-container">
            <img src="${url}" alt="Post Image" class="post-image">
        </div>
        <p class="post-caption">${caption}</p>
        <div class="reaction-container">
            <button class="like-button">${reaction ? '👎 Unlike' : '👍 Like'}</button>
            <span class="like-count">${reaction ? 1 : 0}</span>
        </div>
        <div class="comment-section">
            <input type="text" class="comment-input" placeholder="Add a comment..." />
            <span class="commentCounter">0/200</span>
            <button class="comment-button">Comment</button>
            <div class="comments-list"></div>
        </div>
    `;
    container.appendChild(post);

    const menuOptions = post.querySelector('.menu-options');
    post.querySelector('.menu-button').addEventListener('click', () => {
        menuOptions.classList.toggle('hidden');
    });

    post.querySelector('.confirm-delete').addEventListener('click', async () => {
        if (confirm('Are you sure?')) {
            await deletePost(pid, uid);
            post.remove();
        }
    });

    post.querySelector('.edit-caption').addEventListener('click', async () => {
        const newCaption = prompt('Edit caption:', caption);
        if (newCaption && newCaption.length <= 200) {
            post.querySelector('.post-caption').textContent = newCaption;
            await editPost(pid, newCaption, uid);
        } else if (newCaption.length > 200) {
            alert('Caption too long.');
        }
        menuOptions.classList.add('hidden');
    });

    const likeBtn = post.querySelector('.like-button');
    const likeCount = post.querySelector('.like-count');
    likeBtn.addEventListener('click', () => {
        alert('Like/unlike not implemented in API yet.');
    });

    const commentInput = post.querySelector('.comment-input');
    const commentCounter = post.querySelector('.commentCounter');
    const commentButton = post.querySelector('.comment-button');
    const commentsList = post.querySelector('.comments-list');

    commentInput.addEventListener('input', () => {
        const len = commentInput.value.length;
        commentCounter.textContent = `${len}/200`;
        commentCounter.style.color = len > 200 ? 'red' : 'black';
    });

    commentButton.addEventListener('click', async () => {
        const text = commentInput.value.trim();
        if (text.length === 0) return alert('Please enter a comment.');
        if (text.length > 200) return alert('Comment too long.');

        const comment = { cid: generateUUID(), content: text, uid, pid };
        await createComment(comment.cid, comment.content, uid, pid);
        renderComment(comment, commentsList, pid, uid);
        commentInput.value = '';
        commentCounter.textContent = '0/200';
    });

    const postComments = comments || await getAllCommentsFromPost(pid);
    if (Array.isArray(postComments)) {
        postComments.forEach(comment => renderComment(comment, commentsList, pid, uid));
    }
}

function renderComment(comment, container, pid, uid) {
    const { cid, content } = comment;

    const div = document.createElement('div');
    div.classList.add('comment');
    div.innerHTML = `
        <span class="comment-text">${uid}: ${content}</span>
        <div class="comment-menu-container">
            <button class="comment-menu-button">⋮</button>
            <div class="comment-menu-options hidden">
                <button class="edit-comment-button">Edit</button>
                <button class="delete-comment-button">Delete</button>
            </div>
        </div>
    `;
    container.appendChild(div);

    const options = div.querySelector('.comment-menu-options');
    div.querySelector('.comment-menu-button').addEventListener('click', () => {
        options.classList.toggle('hidden');
    });

    div.querySelector('.edit-comment-button').addEventListener('click', async () => {
        const newText = prompt('Edit comment:', content);
        if (newText && newText.length <= 200) {
            div.querySelector('.comment-text').textContent = `${uid}: ${newText}`;
            await editComment(cid, uid, newText);
        } else if (newText.length > 200) {
            alert('Comment too long.');
        }
        options.classList.add('hidden');
    });

    div.querySelector('.delete-comment-button').addEventListener('click', async () => {
        if (confirm('Delete this comment?')) {
            div.remove();
            await deleteComment(cid, uid);
        }
    });
}
