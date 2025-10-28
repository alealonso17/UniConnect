//---------------------------------------------
//---------------------------------------------
//SERVER AND API ENDPOINTS (  POSTS , GET ... )
//---------------------------------------------
//---------------------------------------------



import express from "express"; 
import cors from "cors"; 
import bcrypt, { hash } from "bcrypt"; 
import { conection } from "./db/connection.js";
import { Authentification } from "./utils/Authentification.js";


const app = express(); //start texpress
app.use(cors({ //cors errors , add methods
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json()); //use express json


//----------------------------------------------------
//----------------------------------------------------
//
//----------------------------------------------------
//----------------------------------------------------

app.post("/register", async (req, res) => { // if the api listens to the Post REQUEST from register

    //VARIABLES 

    const {user_handle, password, email, first_name, last_name, university} = req.body; //json format the data passed
    let hashedPass, registeredUsers, registeredEmails;  


    //VALIDATION AND AUTHENTIFICATION 

    //user handle auth 
    const userHandleVal = Authentification.user_handleAuth(user_handle); //run the username autentification methodo from Authentification class 
    
    const [rows] = await conection.execute( //Get the registered users and map them in an array
        'SELECT user_handle FROM users'
    ); 
    registeredUsers = rows.map(u => u.user_handle); 


    if(registeredUsers.includes(user_handle)){ // If each alredy in use 

        console.log("user alredy registered ❌");
        return res.status(400).json({ 
                success: false, 
                error: "Email alredy registered", 
                in : 'user_handle' 
            });

    }else if(!userHandleVal.status){ //if the authentifacion method gave error 

        console.log(userHandleVal.msg); 
        return res.status(400).json({ 
                success: false, 
                error: userHandleVal.msg , 
                in : 'user_handle'
            });
    }


    //password auth 
    const passwordVal = Authentification.passwordAuth(password); //run the authentification method for password in the class Authentification

    if(passwordVal.status){ 
    
         hashedPass = await bcrypt.hash(password, 10);  

    }else{  

        console.log(passwordVal.msg);
        return res.status(400).json({ 
                success: false, 
                error: passwordVal.msg , 
                in : 'password'
            });

    }
    
    //email authentification 

    const [emailRow] = await conection.execute(
        'SELECT email_address FROM users'
    ); 
    registeredEmails = emailRow.map(u => u.email_address);  // get all the eamils in a [] 

    if(registeredEmails.includes(email)){ //check if it alredy exists 
        console.log("Email Alredy Registered ❌");
        return res.status(400).json({
                success: false, 
                in : 'email',
                error : 'Email Alredy Exists' 
            });
        
    }else if(!Authentification.emailAuth(email).status) {

        return res.status(400).json({
            success: false,
            in : 'email',
            error : Authentification.emailAuth(email).msg 
        })
    }

    

    // AUTHENTIFICATION PASSED ? EXECUTE QUERY => 

    try{ //try to execute the query 

        await  conection.execute(
            'INSERT INTO users (user_handle, email_address, password_hash, first_name, last_name, university) VALUES (?, ?, ?, ?, ?, ?)',
            [user_handle, email, hashedPass, first_name, last_name, university] 
        ); 
        console.log("User registered Correctly ✅");
        return res.json({ success: true, message: "User registered successfully!" }); // pass the answer to the fron end script so it doesnt stay waiting and doesnt keep running 

    }catch(err){

        console.log("Error registering the user ❌🛜"); 
        console.error(err); 
        return res.status(500).json({ success: false, error: "Database error" }); 
  }
}); 



//----------------------------------------------------
//----------------------------------------------------
//
//----------------------------------------------------
//----------------------------------------------------

app.post('/login', async (req, res) => { // when accessed login 

    //1. Recieve the data 
    const{email_address, password} = req.body; 

    //2. CHECKS (EMAIL)

    const [emailRows] = await  conection.execute(
        'SELECT email_address FROM users'
    ); 
    const emails = emailRows.map(u => u.email_address);  // get the eamils in [] 

    //2.1 Check if the email exists

    if(!emails.includes(email_address)){ 

        console.log("Email is not registered ❌"); 
        return res.status(400).json({ success: false, in: "log_email", error: "Email is not registered" });

    }

    //2.2 Apply our filter from the Authentification class , to see the constrints we added manually

    const emailFilter = Authentification.emailAuth(email_address); //apply Our filter method from the class

    if(!emailFilter.status){//if the filter => False 
        console.log(emailFilter.msg); 
        return res.status(400).json({ success: false, in: "log_email", error: emailFilter.msg });
    }

    
    //3. CHECKS (PASSWORD)

    //apply our filter  method for passwords of class Authentification for the password 
    const passwordIsCorrect = Authentification.passwordAuth(password); 
    if(!passwordIsCorrect){
        console.log(passwordIsCorrect.msg); 
        return res.status(400).json({ success: false, in: "log_password", error: "Welcome" })
    }


    //4. The email is in the database the password is in correct format  => next step compare the pass stored in db with the one user gave us 
    
    //4.1 Get the hashed pass from the database attached to the email

    const [rows] = await conection.execute(
        'SELECT password_hash FROM users WHERE email_address = ?',
        [email_address]
    );

    if (rows.length === 0) {
        console.log("Email not found ❌");
        return res.status(400).json({ success: false, in: "log_email", error: "Email not found" });
    }

    const hashedPassDB = rows[0].password_hash;  // <- aquí está el hash correcto
    const passwordValidation = await bcrypt.compare(password, hashedPassDB);

    //if passwords where not the same => response and inform 
    if(!passwordValidation) {
        console.log("incorrect password ❌"); 
        return res.status(400).json({ success: false, in: "log_password", error: "incorrect password" });
    }else {
        console.log("Welcome"); 
        return res.status(200).json({ success: true, error: "Welcome", in : "log_pass" });
    }




})






app.listen(3000, () => {
    console.log("Backend Express server running ✅");
})
