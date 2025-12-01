export async function loadProfilePosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "<p class='text-gray-500 mt-4'>Loading...</p>";

    // READ USER FROM URL
    const urlParams = new URLSearchParams(window.location.search);
    const profileHandle = urlParams.get("user");

    if (!profileHandle) {
        postsContainer.innerHTML = "<p class='text-red-500'>Invalid profile</p>";
        return;
    }

    // GET REQUEST TO BACKEND
    const response = await fetch(
        `https://uniconnect-production.up.railway.app/posts/${profileHandle}`
    );

    const data = await response.json();

    if (!response.ok) {
        postsContainer.innerHTML = "<p class='text-red-500'>Error loading posts</p>";
        return;
    }

    const posts = data.posts;

    if (posts.length === 0) {
        postsContainer.innerHTML = "<p class='text-gray-500 mt-4'>No posts yet.</p>";
        return;
    }

    // RENDER POSTS
    postsContainer.innerHTML = posts.map(p => `
        <article class="w-[800px] mt-6 border rounded-2xl bg-white p-5 shadow-sm">

            <p class="text-gray-700 text-[17px] whitespace-pre-wrap">${p.post_text}</p>

            ${p.image_path ? `
                <img src="${p.image_path}" 
                     class="mt-3 rounded-xl max-h-[400px] object-cover"/>
            ` : ""}

            <p class="mt-2 text-gray-400 text-sm">
                ${new Date(p.created_at).toLocaleString()}
            </p>

        </article>
    `).join("");
}
