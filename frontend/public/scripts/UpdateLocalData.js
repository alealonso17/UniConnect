//--------------------------------------------
//--------------------------------------------
//Class for updating localstorage , so if we update the database we can call this function and f5 the page to see the changes 
//--------------------------------------------
//--------------------------------------------


export class UpdateLocalData {

    static async update() {

        //get the token =>. get the user_handle inside =>. call back end sending the user_handle toi get the data. =>. recieve it in the front end => update localstorage here we go 
        const token = localStorage.getItem("user_token");
        if (!token) {
            console.warn("There is no token!, redirecting for security reasons...");
            window.location.href = "./index.html";
            return;
        }

        //decode the token to get the user_handle 
        const playload = JSON.parse(atob(token.split('.')[1]));
        const user_handle = playload.user_handle;


        // now that we have the user handle we do the fetch 
        const response = await fetch("https://uniconnect-production.up.railway.app/updateUserDataLocalStorage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_handle
            })
        });


        //recieve the data from backend id response is ok 
        if (!response.ok) {
            console.log("Error while fetch updating local storage❌");
            console.log(err);
            return;
        }

        const data = await response.json();  //recieve the data 

        if (localStorage.getItem("userData")) {
            localStorage.removeItem("userData")  // clear the local storage if exists 
        }

        localStorage.setItem("userData", JSON.stringify(data.updatedData));  //Add it to the local storage 

        console.log("Local storage updated succesfully ✅");
        return true;





    }

}