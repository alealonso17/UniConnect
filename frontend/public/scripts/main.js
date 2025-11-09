
import { AuthErrorDisplay } from "./AuthErrorDisplay.js";



//-------------------------------------------------------
//-------------------------------------------------------
//REGISTER FORM
//-------------------------------------------------------
//-------------------------------------------------------


const formRegist = document.getElementById("registerForm"); //We get the form  


formRegist.addEventListener("submit", async (e) => { //when submit is pressed .

    e.preventDefault(); //preventing the form form refreshing 

    //get the values
    const user_handle = document.getElementById("user_handle").value.trim();
    const password = document.getElementById("password").value.trim();
    const email = document.getElementById("email").value.trim();
    const first_name = document.getElementById("first_name").value.trim();
    const last_name = document.getElementById("last_name").value.trim();
    const university = document.getElementById("university").value.trim();
    const msg = document.getElementById("registerMsg");

    try { //try to fetch with the public url of oytr server to send our data in json format

        const response = await fetch("https://uniconnect-production.up.railway.app/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_handle, password, email, first_name, last_name, university })
        })

        const data = await response.json(); //get the json response 
        if (!response.ok) {

            AuthErrorDisplay.ErrorReset("registerForm"); //reset error msgs if there was some with the methopdo of the class Auth errDisplay
            AuthErrorDisplay.ErrorFrom(data.error, data.in) // Show messages with the method of the class 

        } else {

            msg.textContent = "Account Created Successfully! Redirecting ... 🚀⏳";
            setTimeout(() => {
                window.location.href = "../frontend/public/logIn.html";
            }, 1500);

        }





    } catch (err) {
        console.log("Error ocurred while fetch 🛜❌");
        console.error(err);
    }



})




//-------------------------------------------------------
//-------------------------------------------------------
//LOG IN FORM 
//-------------------------------------------------------
//-------------------------------------------------------

const loginForm = document.getElementById('loginFormX');

loginForm.addEventListener('submit', async (e) => { //when submit 

    e.preventDefault();

    //1. Get the values 
    const identifier = document.getElementById('log_email').value.trim();
    const password = document.getElementById('log_password').value.trim();



    //2. Send the values to the backend with the Api 
    try {

        const response = await fetch("https://uniconnect-production.up.railway.app/login", {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email_address: identifier,
                password
            })

        });

        const data = await response.json();
        if (!response.ok) {

            AuthErrorDisplay.ErrorReset("loginFormX"); //reset error msgs if there was some with the methopdo of the class Auth errDisplay
            AuthErrorDisplay.ErrorFrom(data.error, data.in) // Show messages with the method of the class 

        } else {

            localStorage.setItem("user_token", data.token); // store the token sent from backend
            localStorage.setItem("userData", JSON.stringify(data.userData));//we recieve also the UserData and we will storage it in user storage.


            const payload = JSON.parse(atob(data.token.split('.')[1])); //a token consist of header.playload.signature. Playload is where the email and user_handle is encrypted and thats what we need so we will split it to get that part (atob for 'descodificar')
            const user_handle = payload.user_handle;// now we store it

            localStorage.setItem("user_handle_URL", encodeURIComponent(user_handle)); //Store it in localstorage

            console.log(localStorage.getItem("user_handle_URL"));


            setTimeout(() => {
                window.location.href = `index.html?user=${localStorage.getItem("user_handle_URL")}`;
            }, 1500);  // redirect with the unique token 


        }


    } catch (err) {

        console.log("Error fetch /login ❌");
        console.log(err);
    }




})


