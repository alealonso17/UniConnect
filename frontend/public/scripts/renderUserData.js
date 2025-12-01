//----------------------------------------------------
//----------------------------------------------------
//A SCRIPT THAT U ADD IN THE HTML , AND IN THE NEDDED SECTIONS ADDIND THE CORRESPONDENT USER DATA 
//----------------------------------------------------
//----------------------------------------------------





//Execute when page is loaded 
document.addEventListener("DOMContentLoaded", () => {

    setTimeout(() => { //I put 300ms of timeout because there are some section like headers that because they are rendered , first they need to be loaded to apply the data succesfully 


        try {

            const userData = JSON.parse(localStorage.getItem("userData")); //Get the JSON of the data stored in local storage
            (!userData) ? null : ''; //if there is nothing return null 
            console.log("User Data Loaded Successfully ✅", localStorage.getItem("userData"));


            //Now that we have the data we will get each element of the html and render it with the information from user data so each user has each own 

            //profile pic 
            const profilePic = document.querySelectorAll(".profilePic");
            if (profilePic.length > 0 && userData.profile_picture) { // If they both exist ( to avoid errors) => change the source
                profilePic.forEach(img => {
                    img.src = userData.profile_picture;
                });

            };

            //fullname 
            const fullName = document.getElementById("fullName");
            if (fullName && userData.first_name && userData.last_name) { // If they both exist ( to avoid errors) => change the source
                fullName.textContent = `${userData.first_name} ${userData.last_name}`;
            };

            //mail 
            const email_address = document.getElementById("email_address");
            if (email_address && userData.email_address) {
                email_address.textContent = userData.email_address;
            };

            //University
            const university = document.getElementById("university");
            if (university && userData.university) { // If they both exist ( to avoid errors) => change the source
                university.textContent = `${userData.university} University`;
            };

            //bio 
            const bio = document.getElementById("userBio");
            if (bio && userData.bio) { // If they both exist ( to avoid errors) => change the source
                bio.textContent = userData.bio;
            };

            //created_at 
            const created_at = document.getElementById("created_at");
            if (created_at && userData.created_at) {
                const date = new Date(userData.created_at);  // tansform sql date to a date object 
                const options = { year: "numeric", month: "long" }; //I want it to show month and year 
                const formatedDate = date.toLocaleDateString("en-GB", options); //Example November 2025 
                created_at.textContent = `Joined ${formatedDate}`;
            };

            // posts count
            const postsText = document.getElementById("postsText");
            if (postsText && userData.posts_count !== undefined) {
                postsText.textContent = userData.posts_count;
            }

            // following count
            const followingText = document.getElementById("followingText");
            if (followingText && userData.following_count !== undefined) {
                followingText.textContent = userData.following_count;
            }

            // connections count
            const connectionsText = document.getElementById("connectionsText");
            if (connectionsText && userData.connections_count !== undefined) {
                connectionsText.textContent = userData.connections_count;
            }
3

        } catch (err) {
            console.log("Error rendering user data ❌ => ", err);
        }

    }, 300);
})