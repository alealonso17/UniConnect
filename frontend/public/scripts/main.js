

import { AuthErrorDisplay } from "./AuthErrorDisplay.js";


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
    
    try{ //try to fetch with the public url of oytr server to send our data in json format

        const response = await fetch("https://uniconnect-production.up.railway.app/register", {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({user_handle, password, email, first_name, last_name, university})
        })

        const data = await response.json(); //get the json response 
        if(!response.ok) {

            AuthErrorDisplay.ErrorReset(); //reset error msgs if there was some with the methopdo of the class Auth errDisplay
            AuthErrorDisplay.ErrorFrom(data.error, data.in) // Show messages with the method of the class 

        }else{
            
            msg.textContent = "Account Created Successfully! Redirecting ... 🚀⏳"; 
            setTimeout(()=>{
                window.location.href = "../frontend/public/logIn.html"; 
            }, 1500);

        }
        




    }catch(err){
        console.log("Error ocurred while fetch 🛜❌"); 
        console.error(err); 
    }  

    
        
})