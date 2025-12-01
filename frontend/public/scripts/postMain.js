import { UpdateLocalData } from "./UpdateLocalData.js";

const postButton = document.getElementById("postButton");
const textArea = document.getElementById("postTextArea");

// When clicking the "Post" button
postButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const content = textArea.value.trim();
    if (!content) {
        alert("Post cannot be empty!");
        return;
    }

    const token = localStorage.getItem("user_token");
    if (!token) {
        alert("Please log in again.");
        return;
    }

    // decode token → get user_handle
    const payload = JSON.parse(atob(token.split(".")[1]));
    const user_handle = payload.user_handle;

    try {
        const response = await fetch("https://uniconnect-production.up.railway.app/createPost", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_handle,
                post_text: content
            })
        });

        const data = await response.json();
        if (!response.ok) {
            alert(data.error || "Error creating post");
            return;
        }

        // clean input
        textArea.value = "";

        // Update localStorage (updates posts_count automatically)
        await UpdateLocalData.update();

        // Reload posts in the feed
        LoadComponents.loadPosts();

        alert("Your post has been published!");

    } catch (err) {
        console.log("❌ Error creating post", err);
    }
});
