//For the profile buttons , interactions, animations ... 

import { DisplaySuccessBox } from "./DisplaySuccessBox.js";
import { UpdateLocalData } from "./UpdateLocalData.js";

//--------------------------------------
//--------------------------------------
//FOR CHANGING THE AVATAR 
//--------------------------------------
//--------------------------------------

//when pressed the profile pic , apear menu to change the avatar 
const changeAvatarButton = document.getElementById('changeAvatarButton');
const main = document.querySelector('main');

changeAvatarButton.addEventListener('click', () => { //when button pressed display html 
    document.body.style.overflow = "hidden";
    main.insertAdjacentHTML(
        "beforeend", /*html*/ `
             <div id="changeAvatarModal" class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
                <div class="p-5 w-[500px] border rounded-xl flex flex-col gap-10 bg-[#f8f9fb] shadow-lg relative">
             <div class="flex justify-between relative">
              
            <h1 class="text-[22px] font-semibold text-gray-800 tracking-tight mb-4 ">Change Profile Picture</h1>
            <button class=" absolute right-0" id='closeChangeAvatar'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 cursor-pointer">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
            </button> 
            </div>

            <!-- ADDED ID SO WE CAN SET THE IMAGE -->
            <img id="modalProfilePic" class="profilePic ml-[35%] rounded-[100%] h-[150px] w-[150px] border">

            <div>
                <label for="profilePicChangeUrl" class=" gap-2 flex flex-col">Image Url
                <input type="text" name=""   class="bg-white p-2 rounded-xl outline-none focus:ring-2 focus:ring-[#5b67ca] transition duration-150 ease-in-out" " placeholder="https://examplepath/image.png" id="profilePicChangeUrlprofilePicChangeUrl" >
                </label>
            </div>
            <div class="flex items-center ">
                <div class="flex-grow h-px bg-gray-300"></div>
                <span class="px-3 text-gray-500 text-sm font-medium">OR</span>
                <div class="flex-grow h-px bg-gray-300"></div>
            </div>

            <label for="profilePicChangeFile" class=" gap-2 flex flex-col">Image File
                <input type="file" name="" id="profilePicChangeFile" class="bg-[white] p-2 rounded-xl">
            </label>

            <div class="flex gap-4 mb-3">
                <button class="flex border border-[grey] hover:border-none items-center gap-2 rounded-xl justify-center p-2   h-[35px] w-[90px]  hover:bg-[#ede7f6] hover:text-[#5b67ca] hover:cursor-pointer transition-all duration-150 ease-in-out" id="cancelChangeAvatar">Cancel</button>
                <button  class="flex items-center justify-center gap-2 h-[35px] w-[90px] rounded-xl hover:bg-[#ede7f6] hover:text-[#5b67ca] hover:border hover:bg-[#5b67ca] p-2 bg-[#5b67ca] font text-[white] cursor-pointer transition-all duration-150 ease-in-out" id="saveChangeAvatar">Save</button>
            </div>
            </div>
            </div>`);

    //-------------------------------------------------------
    //-------------------------------------------------------
    // SHOW CURRENT PROFILE PIC IN MODAL 
    //-------------------------------------------------------
    //-------------------------------------------------------
    const userData = JSON.parse(localStorage.getItem("userData"));      //get user data
    const modalPic = document.getElementById("modalProfilePic");        //select image in modal

    if (modalPic && userData && userData.profile_picture) {            //if exists → set src
        modalPic.src = userData.profile_picture;
    }


    //-------------------------------------------------------
    //-------------------------------------------------------
    //SEND THE PIDCTURE TO BACKEND 
    //-------------------------------------------------------
    //-------------------------------------------------------

    const saveButton = document.getElementById("saveChangeAvatar");

    saveButton.addEventListener('click', async () => { //when butaton pressed
        const changeImageInput = document.getElementById("profilePicChangeFile");
        const file = changeImageInput.files[0]; // get the file 

        if (!file) { //if fuile null say to input a file 
            alert("Please put a file first");
            return;
        }

        if (!file.type.startsWith("image/")) { // check if file is an image 
            alert("Only image files are allowed (JPG, PNG, etc.)");
            return;
        }

        console.log("✅ File is valid:", file.name); //. check s passed , let. the user know 


        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------
        //we update the local storage and the mysql table INSERT CODE 
        //-------------------------------------------------------------------------------------------------------------------------------------------------------------------

        try {
            //we need to pass to the backend the user that wants to upload the picture (we get it from the token),  and the picture 

            //first we get the user handle from the token stored in the locak storage 
            const token = localStorage.getItem("user_token");
            const payload = JSON.parse(atob(token.split('.')[1]));
            const user_handle = payload.user_handle;

            // now we crate a form data and pout both , file and user handle in there to pass it to back end 
            const formData = new FormData();
            formData.append("image", file);
            formData.append("user_handle", user_handle);


            // we psend ti to backend end with api "/profilePicUpload" method POST  ; 
            const response = await fetch("https://uniconnect-production.up.railway.app/profilePicUpload", {
                method: 'POST',
                body: formData
            })


            const data = await response.json();
            console.log("✅ Uploaded successfully:", data);
            await UpdateLocalData.update(); //update the local storrage 
            DisplaySuccessBox.show("Avatar updated successfully"); // Success box  

        } catch (err) {
            console.error("❌ Error while trying to pass image to backend", err);
        }
    })


    // for closing the tab .. 

    //store the closing buttons 
    const closeButton = document.getElementById("closeChangeAvatar");
    const cancelChangeAvatar = document.getElementById("cancelChangeAvatar");

    //create function to close tab if the modal exists 
    const closeModal = () => {
        const modal = document.getElementById("changeAvatarModal");
        if (modal) modal.remove();
        document.body.style.overflow = "auto";
    }

    //addd the eventlisteners 
    closeButton.addEventListener('click', closeModal);
    cancelChangeAvatar.addEventListener('click', closeModal);
})


//------------------------------------------------------------
//------------------------------------------------------------
//EDIT PROFILE BUTTON 
//------------------------------------------------------------
//-----------------------------------------------------------

const editProfileButton = document.getElementById("editProfileButton");

editProfileButton.addEventListener('click', async () => {
    document.body.style.overflow = "hidden";
    
    document.body.insertAdjacentHTML("beforeend", /*html*/`
<div id="editProfileModal" class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
<div id="editProfile" class=" fixed inset-0 z-50 relative bg-[#f8f9fb] w-[700px] h-[670px] rounded-xl p-10 flex flex-col gap-10">

  <button class=" absolute right-5 top-5 cursor-pointer" id='closeEditProfile'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>

  </button>

  <h1 class="text-2xl font-semibold text-gray-800 mb-4">Edit Profile</h1>
  <form action="" class="flex flex-col gap-10">

    <label for="firstName" class=" flex flex-col gap-1">
      First Name 
      <input type="text" id="editFirstName" class="rounded-xl px-3 py-3 rounded-xl px-3 py-3  focus:outline-none focus:ring-2 focus:ring-[#7746e1] transition-all duration-300  bg-[white]">
    </label>

    <label for="lastName" class="  flex flex-col gap-1">
      Last Name 
      <input type="text" id="editLastName" class="rounded-xl px-3 py-3 rounded-xl px-3 py-3  focus:outline-none focus:ring-2 focus:ring-[#7746e1] transition-all duration-300  bg-[white]">
    </label>

    <label for="email" class="flex flex-col gap-1">
      Email 
      <input type="text" id="editEmail" class="rounded-xl px-3 py-3 rounded-xl px-3 py-3  focus:outline-none focus:ring-2 focus:ring-[#7746e1] transition-all duration-300  bg-[white]">
    </label>

    <label for="bio" class="flex flex-col gap-1">
      Bio 
      <input type="text" id ="editBio" class="rounded-xl px-3 py-3 rounded-xl px-3 py-3  focus:outline-none focus:ring-2 focus:ring-[#7746e1] transition-all duration-300  bg-[white]">
    </label>

            <div class=" absolute bottom-4 right-8 flex gap-4 mb-3">
                <button class="flex border border-[grey] hover:border-none items-center gap-2 rounded-xl justify-center p-2   h-[35px] w-[90px]  hover:bg-[#ede7f6] hover:text-[#5b67ca] hover:cursor-pointer transition-all duration-150 ease-in-out" id="cancelEditProfile">Cancel</button>
                <button  class="flex items-center justify-center gap-2 h-[35px] w-[90px] rounded-xl hover:bg-[#ede7f6] hover:text-[#5b67ca] hover:border hover:bg-[#5b67ca] p-2 bg-[#5b67ca] font text-[white] cursor-pointer transition-all duration-150 ease-in-out" id="saveEditProfile">Save</button>
            </div>

  </form>
</div>
</div>`
    )

    //for putting the userData info in the value of each input 
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
        document.getElementById("editFirstName").value = userData.first_name || "";
        document.getElementById("editLastName").value = userData.last_name || "";
        document.getElementById("editEmail").value = userData.email_address || "";
        document.getElementById("editBio").value = userData.bio || "";
    }
    //for sending data to backend 

    const saveProfileEditsButton = document.getElementById("saveEditProfile");
    saveProfileEditsButton.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            //we need to pass to the backend the user that wants to upload the picture (we get it from the token),  and the picture 

            //first we get the user handle from the token stored in the locak storage 
            const token = localStorage.getItem("user_token");
            const payload = JSON.parse(atob(token.split('.')[1]));
            const user_handle = payload.user_handle;



            // we psend ti to backend end with api "/profilePicUpload" method POST  ; 
            const response = await fetch("https://uniconnect-production.up.railway.app/EditProfile", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_handle,
                    first_name: document.getElementById("editFirstName").value.trim(),
                    last_name: document.getElementById("editLastName").value.trim(),
                    email_address: document.getElementById("editEmail").value.trim(),
                    bio: document.getElementById("editBio").value.trim(),

                })
            })


            const data = await response.json();
            console.log("✅ Uploaded successfully:", data);

            await UpdateLocalData.update(); //update the local storrage 
            DisplaySuccessBox.show("Profile Updated successfully"); // Success box  

        } catch (err) {
            console.error("❌ Error while trying to pass new profile info to backend", err);
        }

    }) ; 


    // for closing the tab .. 

    //store the closing buttons 
    const closeEditProfile = document.getElementById("closeEditProfile");
    const cancelEditProfile = document.getElementById("cancelEditProfile");

    //create function to close tab if the modal exists 
    const closeModal = () => {
        const modal = document.getElementById("editProfileModal");
        if (modal) modal.remove();
        document.body.style.overflow = "auto";
    }

    //addd the eventlisteners 
    closeEditProfile.addEventListener('click', closeModal);
    cancelEditProfile.addEventListener('click', closeModal);


});


