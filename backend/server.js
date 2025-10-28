import express from "express"; 
import cors from "cors"; 
import bcrypt, { hash } from "bcrypt"; 
import mysql2 from "mysql2/promise";


const app = express(); //start texpress
app.use(cors({ //cors errors , add methods
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json()); //use express json

let conection;  //variable for conection 

try{ //try to connect with await , take your time , dont want it to execute after the query 

    conection = await mysql2.createConnection({
    host : "mysql.railway.internal",
    user : "root",
    database : "railway",
    password : "IVnnRwnJNIRgvwSCNZyzXArWqJyzBaJB",
    port : "3306"
    }); 

    console.log("mySQL conection stablishes ✅🛜");
}catch(err){
    console.log("❌ Failed to connect to MySQL:", err);
}


//once its connected .... 

app.post("/register", async (req, res) => { // if the api listens to the Post REQUEST from register
    const {user_handle, password, email, first_name, last_name, university} = req.body; //json format the data passed
    const hashedPass = await bcrypt.hash(password, 10); //hash the pass with bcrypt and 10 jumps 

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



})


app.listen(3000, () => {
    console.log("Backend Express server running ✅");
})
