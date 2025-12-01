//---------------------------------------------
//---------------------------------------------
//SERVER AND API ENDPOINTS (  POSTS , GET ... )
//---------------------------------------------
//---------------------------------------------


import jwt from 'jsonwebtoken';
import express from "express";
import cors from "cors";
import bcrypt, { hash } from "bcrypt";
import { conection } from "./db/connection.js";
import { Authentification } from "./utils/Authentification.js";
import path from 'path';
import { fileURLToPath } from "url";
import multer from "multer";
import cloudinary from "./utils/cloudinary.js";
import fs from "fs";
import { LoadUserData } from './utils/LoadUserData.js';

//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------


const app = express(); //start texpress
app.use(cors({//cors errors , add methods
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json()); //use express json


//----------------------------------------------------
//----------------------------------------------------
//REGISER
//----------------------------------------------------
//----------------------------------------------------

app.post("/register", async (req, res) => { // if the api listens to the Post REQUEST from register

    //VARIABLES 

    const { user_handle, password, email_address, first_name, last_name, university } = req.body; //json format the data passed
    let hashedPass, registeredUsers;


    //VALIDATION AND AUTHENTIFICATION 

    //user handle auth 
    const userHandleVal = Authentification.user_handleAuth(user_handle); //run the username autentification methodo from Authentification class 

    if (!userHandleVal.status) {
        return res.status(400).json({
            success: false,
            in: 'user_handle',
            error: userHandleVal.msg
        });
    }
    const [rows] = await conection.execute( //Get the registered users and map them in an array
        'SELECT user_handle FROM users'
    );
    registeredUsers = rows.map(u => u.user_handle);

    if (registeredUsers.includes(user_handle)) {
        return res.status(400).json({
            success: false,
            in: 'user_handle',
            error: 'Username alredy in use'
        });
    }




    //password auth 
    const passwordVal = Authentification.passwordAuth(password); //run the authentification method for password in the class Authentification

    if (passwordVal.status) {

        hashedPass = await bcrypt.hash(password, 10);

    } else {

        console.log(passwordVal.msg);
        return res.status(400).json({
            success: false,
            error: passwordVal.msg,
            in: 'password'
        });

    }

    //email authentification 

    const [emailRow] = await conection.execute('SELECT email_address FROM users');
    const registeredEmails = emailRow.map(u => u.email_address);

    if (registeredEmails.includes(email_address)) {
        console.log("Email Already Registered ❌");
        return res.status(400).json({
            success: false,
            in: 'email',
            error: 'Email Already Exists'
        });
    }

    const emailCheck = Authentification.emailAuth(email_address);
    if (!emailCheck.status) {
        console.log(emailCheck.msg);
        return res.status(400).json({
            success: false,
            in: 'email',
            error: emailCheck.msg
        });
    }


    //not empty checks

    if (!email_address) {
        return res.status(400).json({
            success: false,
            in: 'email_address',
            error: "Insert Email"
        });
    }


    if (!first_name) {
        return res.status(400).json({
            success: false,
            in: 'first_name',
            error: "Insert First Name"
        });
    }

    if (!last_name) {
        return res.status(400).json({
            success: false,
            in: 'last_name',
            error: "Insert Last Name"
        });
    }
    if (!university) {
        return res.status(400).json({
            success: false,
            in: 'university',
            error: "Insert University"
        });
    }



    // AUTHENTIFICATION PASSED ? EXECUTE QUERY => 

    try { //try to execute the query 

        await conection.execute(
            'INSERT INTO users (user_handle, email_address, password_hash, first_name, last_name, university) VALUES (?, ?, ?, ?, ?, ?)',
            [user_handle, email_address, hashedPass, first_name, last_name, university]
        );
        console.log("User registered Correctly ✅");
        return res.json({ success: true, message: "User registered successfully!" }); // pass the answer to the fron end script so it doesnt stay waiting and doesnt keep running 

    } catch (err) {

        console.log("Error registering the user ❌🛜");
        console.error(err);
        return res.status(500).json({ success: false, error: "Database error" });
    }
});



//----------------------------------------------------
//----------------------------------------------------
//LOGIN
//----------------------------------------------------
//----------------------------------------------------

app.post('/login', async (req, res) => { // when accessed login 

    //1. Recieve the data 
    const { email_address, password } = req.body;

    //2. CHECKS (EMAIL)

    const [emailRows] = await conection.execute(
        'SELECT email_address FROM users'
    );
    const emails = emailRows.map(u => u.email_address);  // get the eamils in [] 

    //2.1 Check if the email exists

    if (!emails.includes(email_address)) {

        console.log("Email is not registered ❌");
        return res.status(400).json({ success: false, in: "log_email", error: "Email is not registered" });

    }

    //2.2 Apply our filter from the Authentification class , to see the constrints we added manually

    const emailFilter = Authentification.emailAuth(email_address); //apply Our filter method from the class

    if (!emailFilter.status) {//if the filter => False 
        console.log(emailFilter.msg);
        return res.status(400).json({ success: false, in: "log_email", error: "Incorrect Password" });
    }


    //3. CHECKS (PASSWORD)

    //apply our filter  method for passwords of class Authentification for the password 
    const passwordIsCorrect = Authentification.passwordAuth(password);
    if (!passwordIsCorrect.status) {
        console.log(passwordIsCorrect.msg);
        return res.status(400).json({ success: false, in: "log_password", error: passwordIsCorrect.msg })
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
    if (!passwordValidation) {

        console.log("incorrect password ❌");
        return res.status(400).json({ success: false, in: "log_password", error: "incorrect password" });

    } else {//USER LOGGED IN  SUCCESSFULLY

        //for creating the token ill get the userhandle instead of the email , is more profesional . So we will ask for user handle 
        const [result] = await conection.execute(
            'SELECT user_handle FROM users WHERE email_address LIKE ?',
            [email_address]
        );  // get the array of results



        const user_handle = result[0]?.user_handle; //get the first one 

        //Create Token => send to frontend =>. validate. => relocate
        const token = jwt.sign(
            { email_address, user_handle },
            'UniConnectRedirectSecretT0ken',
            { expiresIn: '2h' }
        );
        console.log("Welcome (token created successfully✅) ");

        //now I will load the user data stored to pass it to the front end and put it in the local storage to access it
        let userData = null;

        try {
            userData = await LoadUserData.loadAll(user_handle); //ill use a class I created only for getting data from the mysql table users 
            console.log("Data Loaded Succesfully ");
        } catch (err) {
            console.log("Error loading USerData => ", err);
            return null;
        }


        return res.status(200).json({ success: true, error: "Welcome", in: "log_pass", token, userData });
    }




})

//----------------------------------------------------
//----------------------------------------------------
//Profile picture update
//----------------------------------------------------
//----------------------------------------------------

const upload = multer({ dest: path.resolve("./uploads") });


app.post("/profilePicUpload", upload.single("image"), async (req, res) => {

    try {
        console.log("Image recieved ✅", req.file); // if image recieved send message

        //Upload to cloudinary 
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "UniConnect/profile_pics",
            resource_type: "auto",
        }); // upload it to cloudinay to the folder profile_pics 

        console.log(`Url created successfully cloudinary`); //send that everything is working scorrectly and delete the local file (is now uploaded to cloudyinary)
        fs.unlinkSync(req.file.path);

        const { user_handle } = req.body; // we get from the body the user handle 
        if (!user_handle) { //if there is not suser handle return error 
            return res.status(400).json({ success: false, error: "Missing user_handle" });
        }

        await conection.execute( // upload to the table the url 
            "UPDATE users SET profile_picture = ? WHERE user_handle = ?",
            [result.secure_url, user_handle]
        );

        return res.status(200).json({ success: true, error: "imagae uploaded", imageURL: result.secure_url });


    } catch (err) {
        console.log(err);
        console.log("Error trying to upload image in the backend")
    }

});







//----------------------------------------------------
//----------------------------------------------------
//update local storage function 
//----------------------------------------------------
//----------------------------------------------------

app.post("/updateUserDataLocalStorage", async (req, res) => {


    const { user_handle } = req.body; //get the data from api 
    try {
        const updatedData = await LoadUserData.loadAll(user_handle); //get the data from sql 
        if (!updatedData) { //if its empty or null 
            console.log("There was an error loading the data for de /updateUserData fetch (!updateddata)");
            return res.status(400).json({ success: false, error: "error" });
        }

        return res.status(200).json({ success: true, error: "Data sent successfully", updatedData });

    } catch (err) {
        console.log("There was an error loading the data for de /updateUserData fetch", err);
        return res.status(400).json({ success: false, error: "error" });
    }




});

//----------------------------------------------------
//----------------------------------------------------
//EDIT PROFILE
//----------------------------------------------------
//----------------------------------------------------


app.post('/EditProfile', async (req, res) => {

    try {
        const { user_handle, first_name, last_name, email_address, bio } = req.body;
        await conection.execute(
            `UPDATE users 
            SET email_address = ?, first_name = ?, last_name = ?, bio = ?
            WHERE user_handle = ?`,
            [email_address, first_name, last_name, bio, user_handle]
        );

        console.log("Data succesfully updated");
        return res.status(200).json({ success: true, error: "Data succesfully updated" });

    } catch (err) {

        console.log("Error while updating profile ", err);
        return res.status(400).json({ success: false, error: "error" });
    }


})


//----------------------------------------------------
//----------------------------------------------------
//CREATE POST 
//----------------------------------------------------
//----------------------------------------------------

app.post("/createPost", async (req, res) => {
    try {
        const { user_handle, post_text, image_path } = req.body; // Get the neccesary data to post something and insert in inm the sql 

        if (!post_text || post_text.trim().length === 0) { // check if the post is in correct format 
            return res.status(400).json({ success: false, error: "Post cannot be empty" });
        }

        // get user_id from handle
        const [rows] = await conection.execute(
            "SELECT user_id FROM users WHERE user_handle = ?",
            [user_handle]
        );

        if (rows.length === 0) { // If there is no user like that 
            return res.status(400).json({ success: false, error: "User not found" });
        }

        const user_id = rows[0].user_id; // Get the user id 

        // insert post
        await conection.execute(
            `INSERT INTO posts (user_id, post_text, image_path)
             VALUES (?, ?, ?)`,
            [user_id, post_text, image_path || null]
        );

        return res.status(200).json({ success: true, message: "Post created successfully" });

    } catch (err) {
        console.log("❌ Error creating post:", err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
});

//----------------------------------------------------
// GET USER POSTS 
//----------------------------------------------------
app.get("/posts/:user_handle", async (req, res) => {
    try {
        const user_handle = req.params.user_handle;

        // get user_id
        const [u] = await conection.execute(
            "SELECT user_id FROM users WHERE user_handle = ?",
            [user_handle]
        );

        if (u.length === 0) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const user_id = u[0].user_id;

        // get posts
        const [posts] = await conection.execute(
            `SELECT 
                post_id,
                post_text,
                image_path,
                created_at
             FROM posts
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [user_id]
        );

        return res.status(200).json({ success: true, posts });

    } catch (err) {
        console.log("❌ Error fetching posts:", err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
});

//----------------------------------------------------
// UPLOAD POST IMAGE → CLOUDINARY
//----------------------------------------------------
app.post("/uploadPostImage", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "No image received" });
        }

        // Upload to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "UniConnect/post_images",
            resource_type: "auto",
        });

        fs.unlinkSync(req.file.path); // delete local temp

        return res.status(200).json({
            success: true,
            imageURL: result.secure_url
        });

    } catch (err) {
        console.log("❌ Error uploading post image:", err);
        return res.status(500).json({ success: false, error: "Upload failed" });
    }
});

// Wew add this 2 lines for redircting the page , if I go in the frent en window.relocate ="index.html" , the backend doesnt know where to go , because the only 2 endpoints i have are /register and / login
const __filemane = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filemane);

// So we get everything that is inside public 
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public/logIn.html"))
})



app.listen(3000, () => {
    console.log("Backend Express server running ✅");
})
