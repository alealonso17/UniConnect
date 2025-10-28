import express from "express"; 
import cors from "cors"; 
import bcrypt, { hash } from "bcrypt"; 
import { conection } from "./db/connection";
import { Authentification } from "./Authentification";


const app = express(); //start texpress
app.use(cors({ //cors errors , add methods
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json()); //use express json


app.post("/register", async (req, res) => { // if the api listens to the Post REQUEST from register

    //VARIABLES 

    const {user_handle, password, email, first_name, last_name, university} = req.body; //json format the data passed
    let hashedPass, registeredUsers;  


    //VALIDATION AND AUTHENTIFICATION 

    //user handle auth 
    const userHandleVal = Authentification.user_handleAuth(user_handle); //run the username autentification methodo from Authentification class 
    
    const [rows] = await conection.execute( //Get the registered users and map them in an array
        'SELECT user_handle FROM users'
    ); 
    registeredUsers = rows.map(u => u.user_handle); 


    if(registeredUsers.includes(user_handle)){ // If each alredy in use 

        console.log("user alredy registered ❌");
        return res.status(400).json({ success: false, error: "User alredy registered or user not unique" });

    }else if(!userHandleVal.status){ //if the authentifacion method gave error 

        console.log(userHandleVal.msg); 
        return res.status(400).json({ success: false, error: userHandleVal.msg });
    }


    //password auth 
    const passwordVal = Authentification.passwordAuth(password); //run the authentification method for password in the class Authentification

    if(passwordVal.status){ 
    
         hashedPass = await bcrypt.hash(password, 10);  

    }else{  

        console.log(passwordVal.msg);
        return res.status(400).json({ success: false, error: passwordVal.msg });

    }
    

    

    // AUTHENTIFICATION PASSED ? EXECUTE QUERY => 

    try{ //try to execute the query 

        await  conection.execute(
            'INSERT INTO users (user_handle, email_address, password_hash, first_name, last_name, university) VALUES (?, ?, ?, ?, ?, ?)',
            [user_handle, email, hashedPass, first_name, last_name, university] 
        ); 
        console.log("User registered Correctly ✅");
        res.json({ success: true, message: "User registered successfully!" }); // pass the answer to the fron end script so it doesnt stay waiting and doesnt keep running 

    }catch(err){

        console.log("Error registering the user ❌🛜"); 
        console.error(err); 
        res.status(500).json({ success: false, error: "Database error" }); 
  }
}); 








app.listen(3000, () => {
    console.log("Backend Express server running ✅");
})
