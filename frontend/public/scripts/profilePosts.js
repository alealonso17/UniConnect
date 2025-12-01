export async function loadProfilePosts() {
    const postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "<p class='text-gray-500 mt-4'>Loading...</p>";

    // USER FROM URL
    const urlParams = new URLSearchParams(window.location.search);
    const profileHandle = urlParams.get("user");

    if (!profileHandle) {
        postsContainer.innerHTML = "<p class='text-red-500'>Invalid profile</p>";
        return;
    }

    // ------------- GET localStorage USER DATA -------------
    const userData = JSON.parse(localStorage.getItem("userData"));
    const profilePic = userData?.profile_picture || "";
    const fullName = `${userData?.first_name || ""} ${userData?.last_name || ""}`;
    const universityFromLS = userData?.university || "";
    // -------------------------------------------------------

    // GET REQUEST TO BACKEND FOR POSTS
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

    const sizeW = "1200px"; // profile is wide

    // -------------------------
    // RENDER POSTS (USING LOCALSTORAGE)
    // -------------------------
    postsContainer.innerHTML = posts.map(post => `
        <article class="w-[${sizeW}] rounded-2xl mb-10 bg-white border p-6">

            <!-- HEADER -->
            <header class="flex items-center gap-4 mb-4">
                <img src="${profilePic}" 
                     class="profilePicture w-12 h-12 rounded-full object-cover">

                <div>
                    <h1 class="font-semibold text-[17px] text-gray-800">
                        ${fullName}
                    </h1>
                    <p class="text-gray-500 text-[15px]">
                        ${universityFromLS} • ${new Date(post.created_at).toLocaleString()}
                    </p>
                </div>
            </header>

            <!-- CONTENT -->
            <section class="articleContent mb-4">
                <p class="text-[17px] text-gray-700 whitespace-pre-wrap">
                    ${post.post_text}
                </p>

                ${post.image_path ? `
                <img src="${post.image_path}"
                    class="mt-4 rounded-xl max-h-[500px] object-cover mx-auto">
                ` : ""}
            </section>

            <!-- FOOTER -->
            <footer class="flex justify-between w-[1200px] border-t pt-3 mt-4">

                <div class="flex gap-3">

                    <button class="p-2 rounded-xl hover:bg-[#ede7f6] hover:text-[#5b67ca] transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
                             viewBox="0 0 24 24" stroke-width="1.5" 
                             stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5
                                -1.935 0-3.597 1.126-4.312 2.733
                                -.715-1.607-2.377-2.733-4.313-2.733
                                C5.1 3.75 3 5.765 3 8.25c0 7.22 
                                9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        <h4>0</h4>
                    </button>

                    <button class="p-2 rounded-xl hover:bg-[#ede7f6] hover:text-[#5b67ca] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                  stroke="currentColor" class="size-6">
                                  <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                              </svg>
                        <h4>0</h4>
                    </button>

                </div>

                <button class="p-2 rounded-xl hover:bg-[#ede7f6] hover:text-[#5b67ca] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
                         viewBox="0 0 24 24" stroke-width="1.5" 
                         stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M7.217 10.907a2.25 2.25 0 1 0 
                            0 2.186m0-2.186c.18.324.283.696.283 
                            1.093s-.103.77-.283 1.093m0-2.186 
                            9.566-5.314m-9.566 7.5 9.566 
                            5.314m0 0a2.25 2.25 0 1 0 
                            3.935 2.186 2.25 2.25 0 0 0 
                            -3.935-2.186Zm0-12.814a2.25 
                            2.25 0 1 0 3.933-2.185 
                            2.25 2.25 0 0 0-3.933 2.185Z" />
                    </svg>
                </button>

            </footer>

        </article>
    `).join("");
}
