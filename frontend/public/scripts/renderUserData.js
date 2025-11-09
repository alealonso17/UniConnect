//----------------------------------------------------
//----------------------------------------------------
//A SCRIPT THAT U ADD IN THE HTML , AND IN THE NEDDED SECTIONS ADDIND THE CORRESPONDENT USER DATA 
//----------------------------------------------------
//----------------------------------------------------



//Execute when page is loaded 
document.addEventListener("DOMContentLoaded", () => {

    try {

        const userData = JSON.parse(localStorage.getItem("userData")); //Get the JSON of the data stored in local storage
        (!userData) ? null : ''; //if there is nothing return null 
        console.log("User Data Loaded Successfully ✅", localStorage.getItem("userData"));


        //Now that we have the data we will get each element of the html and render it with the information from user data so each user has each own 

        //profile pic 
        const profilePic = document.getElementById("profilePic");
        if (profilePic && userData.profile_picture) { // If they both exist ( to avoid errors) => change the source
            profilePic.src = userData.profile_picture;
        };

        //fullname 
        const fullName = document.getElementById("fullName");
        if (fullName && userData.first_name && userData.last_name) { // If they both exist ( to avoid errors) => change the source
            fullName.textContent = `${userData.first_name} ${userData.last_name}`;
        };

        //University
        const university = document.getElementById("university");
        if (university && userData.university) { // If they both exist ( to avoid errors) => change the source
            university.textContent = userData.university;
        };

        //bio 
        const bio = document.getElementById("userBio");
        if (bio && userData.bio) { // If they both exist ( to avoid errors) => change the source
            bio.textContent = userData.bio;
        };

        //

    } catch (err) {
        console.log("Error rendering user data ❌ => ", err) ; 
    }
})