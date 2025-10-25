const API_BASE = ""; // the api of railway

const register_form = document.getElementById("registerForm"); //the form of login.html
const msg = document.getElementById("registration_msg") // the labelof login.html

register_form.addEventListener("submit", async(submitButton) => {
    submitButton.preventDefault();  // prevent the default way of working , ill say how it works bellow now 

    //FROM NOW ON WHEN THE SUBMIT BUTTON PRESSED ... 

    const payload = { // create dictionary with the values introduced in each label 
        user_handle : document.getElementById("handle").value.trim(),
        first_name : document.getElementById("first_name").value.trim(),
        last_name : document.getElementById("last_name").value.trim(),
        email : document.getElementById("email").value.trim(),
        university : document.getElementById("university").value.trim(),
        password : document.getElementById("password").value.trim()
    }

    //Show what is happening to user 
    msg.textContent = "⏳ Registering User ..."; 

    //try to ... 
    try{

        //response will execute and stop the rest from executing early on with await 
        const res = await fetch(`${API_BASE}/api/register`, {
            method : "POST", 
            headers : {"Content-Type": "application/json"},
            body : JSON.stringify(payload) 
        });


        const data = await res.json(); // get the status of the json

        if(!res.ok){ //is its not okay displayy and return 
            console.log(`${data.error ||"❌ Something went wrong in **register.js**"}`);
            return; 
        }

        msg.textContent = "✅ Account Registered Successfully, Redirecting ... ";  // if the "if " block didnt display show everything went correctly
        setTimeout(() => { 
            window.location.href = "./logIn.html" //refresh the page so the info goes in a timeout of 1.5s 
        }, 1500);
        
        
        //if not possible catch the error and display it 
    } catch(err){
       console.error("⚠️ Could not connect to the server") ; 
       console.log(err); 

    }
})