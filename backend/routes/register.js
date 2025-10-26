import express from "express"; 
import bcrypt from "bcrypt"; 
import mysql from "mysql"; 


const router = express.Router(); 

router.post("/api/register", async (req, res) => {

    try{

        res.json({ message: "data received" }); 
        const {user_handle, first_name, last_name, email, university, password} = req.body; 

        if (!user_handle || !email || !password || !university ){
            console.log("Missing required fields");
        }

        const db = await mysql.createConnection({
            host: process.env.MYSQLHOST,
            user: process.env.MYSQLUSER,
            password: process.env.MYSQLPASSWORD,
            database: process.env.MYSQLDATABASE,
            port: process.env.MYSQLPORT,
        });

        const hashedPass = await bcrypt.hash(password, 10); 

        await db.execute(
        `INSERT INTO users (user_handle, first_name, last_name, email_address, password_hash, bio)
            VALUES (?, ?, ?, ?, ?, ?)`,
        [user_handle, first_name, last_name, email, hashedPassword, `🎓 ${university}`]
        ); 

        await db.end(); 

        res.status(201).json({message : "User registered succesfull ✅"})

    }catch(error){
        console.error("❌ Error in api/register:", error ); 
        res.status(500).json({error : "sercer error while registering user"})
    }
    
    

}); 

export default router; 