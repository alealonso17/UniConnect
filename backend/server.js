import express from "express"; 
import cors from "cors"; 
import dotenv from "dotenv"; 
dotenv.config(); 

// Express app initialitation 
const app = express(); 
app.use(cors()); 
app.use(express.json());

//Route example 
app.get("/", (req, res) => {
    res.send("✅ UniConnect backend running succesfully")
}); 


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running succesfully on port => ${PORT}`)); 
