const registerForm = document.getElementById("registerForm"); //We get the form 


registerForm.addEventListener("submit", async (e) => {
    const user_handle = document.getElementById("user_handle").value.trim();  
    const password = document.getElementById("password").value.trim();  
    const email = document.getElementById("email").value.trim();  
    const first_name = document.getElementById("first_name").value.trim();  
    const last_name = document.getElementById("last_name").value.trim();  
    const university = document.getElementById("university").value.trim(); 
    
    try{
        const response = await fetch("http://uniconnect-production.up.railway.app/register", {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({user_handle, password, email, first_name, last_name, university})
        })
    }catch(err){
        console.log("Error ocurred while fetch 🛜❌"); 
        console.error(err); 
    }

})