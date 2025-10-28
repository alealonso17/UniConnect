import express from "express"; 
import cors from "cors"; 
import bcrypt, { hash } from "bcrypt"; 
import mysql2 from "mysql2";


const app = express(); 
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json()); 

const conection = mysql2.createConnection({
    host : "mysql://root:IVnnRwnJNIRgvwSCNZyzXArWqJyzBaJB@shuttle.proxy.rlwy.net:50152/railway",
    user : "root",
    database : "railway",
    password : "IVnnRwnJNIRgvwSCNZyzXArWqJyzBaJB",
    port : "3306"

})


app.post("/register", async (req, res) => {
    const {user_handle, password, email, first_name, last_name, university} = req.body;
    const hashedPass = await bcrypt.hash(password, 10); 

    try{

        await conection.query(
            'INSERT INTO users (user_handle, email_address, password_hash, first_name, last_name, university) VALUES (?, ?, ?, ?, ?, ?)',
            [user_handle, email, hashedPass, first_name, last_name, university]
        ); 
        console.log("User registered Correctly ✅");

    }catch(err){

        console.log("Error registering the user ❌🛜"); 
        console.error(err); 
    }



})


app.listen(3000, () => {
    console.log("Backend Express server running ✅");
})
