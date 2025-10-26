import express from "express"; 
import cors from "cors"; 
import dotenv from "dotenv"; 
dotenv.config(); 


// Express app initialitation 
const app = express();  
app.set("trust proxy", 1); 
app.use(express.json());
//cors problem 
app.use(cors({
  origin: "*",              
  methods: ["GET", "POST"], 
  allowedHeaders: ["Content-Type"]
}));


//Route example 
app.get("/", (req, res) => {
    res.send("✅ UniConnect backend running succesfully")
}); 


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running succesfully on port => ${PORT}`)); 
