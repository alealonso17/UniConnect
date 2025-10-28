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
    
    try{ //try to fetch with the public url of oytr server to send our data in json format

        const response = await fetch("https://uniconnect-production.up.railway.app/register", {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({user_handle, password, email, first_name, last_name, university})
        })

        const data = await response.json(); //get the json response 
       
        //output the errors for user to change 
        if (!response.ok){
            (data.in === "user_handle") ? alert(`${data.in}: ${data.error}`) : "";  
            (data.in === "password") ? alert(`${data.in}: ${data.error}`) : "";  
            (data.in === "email") ? alert(`${data.in}: ${data.error}`) : "";  

        }





    }catch(err){
        console.log("Error ocurred while fetch 🛜❌"); 
        console.error(err); 
    }  

    
        
})