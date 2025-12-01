import { UpdateLocalData } from "./UpdateLocalData.js";

const postButton = document.getElementById("postButton");
const textArea = document.getElementById("postTextArea");
const imageInput = document.getElementById("postImageFile");

postButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const content = textArea.value.trim();
    if (!content && !imageInput.files[0]) {
        alert("Post cannot be empty!");
        return;
    }

    const token = localStorage.getItem("user_token");
    const payload = JSON.parse(atob(token.split('.')[1]));
    const user_handle = payload.user_handle;

    let imageURL = null;

    // 1️⃣ If the user selected an image → upload to Cloudinary
    if (imageInput.files[0]) {
        const img = imageInput.files[0];

        const formData = new FormData();
        formData.append("image", img);

        const upload = await fetch("https://uniconnect-production.up.railway.app/uploadPostImage", {
            method: "POST",
            body: formData
        });

        const uploadData = await upload.json();
        if (!upload.ok) {
            alert("Error uploading image");
            return;
        }

        imageURL = uploadData.imageURL;
    }

    // 2️⃣ Now CREATE THE POST in MySQL
    const response = await fetch("https://uniconnect-production.up.railway.app/createPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_handle,
            post_text: content,
            image_path: imageURL
        })
    });

    const data = await response.json();
    if (!response.ok) {
        alert(data.error || "Error creating post");
        return;
    }

    // 3️⃣ Clean everything
    textArea.value = "";
    imageInput.value = "";

    // 4️⃣ Update local storage stats
    await UpdateLocalData.update();

    // 5️⃣ Refresh feed or profile posts
    if (window.location.href.includes("profile.html")) {
        // profile page
        import("./profilePosts.js").then(({ loadProfilePosts }) => loadProfilePosts());
    } else {
        // feed page
        LoadComponents.loadPosts();
    }

    alert("Post created!");
});
