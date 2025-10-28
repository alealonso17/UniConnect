import express from "express"; 
import cors from "cors"; 
import bcrypt, { hash } from "bcrypt"; 

const app = express(); 
app.use(cors()); 
app.use(express.json()); 





app.listen(3000, () => {
    console.log("Backend Express server running ✅");
})
