const token = localStorage.getItem("token");
const username = localStorage.getItem("username");
const profilePicture = localStorage.getItem("profilePicture");

if (!token) {
  window.location.href = "login.html";
}

const API_URL = "https://myfacebook-t7eo.onrender.com/posts";

const postInput = document.querySelector(".create-post input");
const postButton = document.querySelector(".create-post button");
const createPostBox = document.querySelector(".create-post");

function renderPost(post) {
  const newPost = document.createElement("div");
  newPost.classList.add("post");
  newPost.dataset.id = post._id;

  const liked = post.likes.includes(username);
  const isOwner = post.username === username;

  const commentsHtml = post.comments
    .map(
      (c) => `
    <div class="comment">
      <span class="comment-username">${c.username}:</span>
      <span class="comment-text">${c.text}</span>
    </div>
  `,
    )
    .join("");

  newPost.innerHTML = `
    <div class="post-header">
      <img class="avatar" src="${post.profilePicture || "https://api.dicebear.com/7.x/initials/svg?seed=" + post.username}" />
      <span class="username">${post.username}</span>
      ${
        isOwner
          ? `
        <div class="owner-actions">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      `
          : ""
      }
    </div>

    <p class="post-content">${post.content}</p>

    <div class="post-actions">
      <button class="like-btn ${liked ? "liked" : ""}">
        👍 Like <span class="like-count">${post.likes.length}</span>
      </button>
      <span class="comment-count">${post.comments.length} comments</span>
    </div>

    <div class="comments-section">
      ${commentsHtml}
    </div>

    <div class="add-comment">
      <input type="text" class="comment-input" placeholder="Write a comment..." />
      <button class="comment-btn">Send</button>
    </div>
  `;

  // LIKE
  newPost.querySelector(".like-btn").addEventListener("click", async () => {
    const res = await fetch(`${API_URL}/${post._id}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const updatedPost = await res.json();
    newPost.replaceWith(renderPost(updatedPost));
  });

  // COMMENT
  const commentInput = newPost.querySelector(".comment-input");
  newPost.querySelector(".comment-btn").addEventListener("click", async () => {
    const text = commentInput.value.trim();
    if (text === "") return;

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: text,
        username: username,
        profilePicture: profilePicture,
      }),
    });
    const updatedPost = await res.json();
    newPost.replaceWith(renderPost(updatedPost));
  });

  // EDIT (only present if isOwner)
  const editBtn = newPost.querySelector(".edit-btn");
  if (editBtn) {
    editBtn.addEventListener("click", async () => {
      const contentEl = newPost.querySelector(".post-content");
      const newText = prompt("Edit your post:", post.content);

      if (newText === null || newText.trim() === "") return;

      const res = await fetch(`${API_URL}/${post._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, content: newText.trim() }),
      });
      const updatedPost = await res.json();
      newPost.replaceWith(renderPost(updatedPost));
    });
  }

  // DELETE (only present if isOwner)
  const deleteBtn = newPost.querySelector(".delete-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      const confirmDelete = confirm("Delete this post?");
      if (!confirmDelete) return;

      await fetch(`${API_URL}/${post._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      newPost.remove();
    });
  }

  return newPost;
}

async function loadPosts() {
  try {
    const res = await fetch(API_URL);
    const posts = await res.json();
    posts.forEach((post) => {
      const postEl = renderPost(post);
      createPostBox.after(postEl);
    });
  } catch (err) {
    console.error("Error loading posts:", err);
  }
}

postButton.addEventListener("click", async () => {
  const text = postInput.value.trim();
  if (text === "") return;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, username: username }),
    });

    const savedPost = await res.json();
    const postEl = renderPost(savedPost);
    createPostBox.after(postEl);

    postInput.value = "";
  } catch (err) {
    console.error("Error saving post:", err);
  }
});

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "login.html";
  });
}

loadPosts();
