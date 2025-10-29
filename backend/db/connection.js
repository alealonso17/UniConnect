//---------------------------------------------
//SIMPLE JS SCRIPT FOR STABLISHING CONECTION WITH SQL AND EXPORTING THE CONECTION 
//---------------------------------------------
//---------------------------------------------
//---------------------------------------------

import mysql2 from 'mysql2/promise'; 
 


export const conection =  mysql2.createPool({
host : "mysql.railway.internal",
user : "root",
database : "railway",
password : "IVnnRwnJNIRgvwSCNZyzXArWqJyzBaJB",
port : "3306",
connectionLimit : 10,
waitForConnections : true , 
queueLimit : 0
}); 

console.log("mySQL conection stablishes ✅🛜");


    
