//---------------------------------------------
//---------------------------------------------
//SIMPLE JS SCRIPT FOR STABLISHING CONECTION WITH SQL AND EXPORTING THE CONECTION 
//---------------------------------------------
//---------------------------------------------

import mysql2 from 'mysql2/promise'; 
export let conection; 

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