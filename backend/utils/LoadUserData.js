//--------------------------------------
//--------------------------------------
//THIS WILL BE A CLASS FOR GETTING DATA FROM USER 
//--------------------------------------
//--------------------------------------
import { conection } from "../db/connection.js";

export class LoadUserData {

    static async loadEmailAddress(user_handle) {
        try {
            const [rows] = await conection.execute(
                'SELECT email_address FROM users WHERE user_handle LIKE ? ; ',
                [user_handle]
            );
            return rows[0]?.email_address || null;
        } catch (err) {
            console.log("Error loading emailaddress in class LoadUserData.js => ", err);

        }
    }


    static async loadFirstName(user_handle) {

        try {
            const [rows] = await conection.execute(
                "SELECT first_name FROM users WHERE user_handle = ?",
                [user_handle]
            );
            return rows[0]?.first_name || null;

        } catch (err) {
            console.log("Error loading firstname in class LoadUserData.js => ", err);

        }
    }

    static async loadLastName(user_handle) {

        try {
            const [rows] = await conection.execute(
                "SELECT last_name FROM users WHERE user_handle = ?",
                [user_handle]
            );
            return rows[0]?.last_name || null;

        } catch (err) {
            console.log("Error loading last name in class LoadUserData.js => ", err);

        }
    }

    static async loadPhoneNumber(user_handle) {

        try {
            const [rows] = await conection.execute(
                "SELECT phonenumber FROM users WHERE user_handle = ?",
                [user_handle]
            );
            return rows[0]?.phonenumber || null;

        } catch (err) {
            console.log("Error loading user handle in class LoadUserData.js => ", err);

        }
    }

    static async loadBio(user_handle) {

        try {
            const [rows] = await conection.execute(
                "SELECT bio FROM users WHERE user_handle = ?",
                [user_handle]
            );
            return rows[0]?.bio || null;

        } catch (err) {
            console.log("Error loading bio in class LoadUserData.js => ", err);
        }
    }

    static async loadProfilePic(user_handle) {

        try {
            const [rows] = await conection.execute(
                "SELECT profile_picture FROM users WHERE user_handle = ?",
                [user_handle]
            );
            return rows[0]?.profile_picture || null;

        } catch (err) {
            console.log("Error loading profilepic in class LoadUserData.js => ", err);
        }

    }

    static async loadUniversity(user_handle) {

        try {
            const [rows] = await conection.execute(
                "SELECT university FROM users WHERE user_handle = ?",
                [user_handle]
            );
            return rows[0]?.university || null;

        } catch (err) {
            console.log("Error loading university in class LoadUserData.js => ", err);
        }
    }

    static async loadCreatedAt(user_handle) {

        try {
            const [rows] = await conection.execute(
                "SELECT created_at FROM users WHERE user_handle = ?",
                [user_handle]
            );
            return rows[0]?.created_at || null;

        } catch (err) {
            console.log("Error loading createdAt in class LoadUserData.js => ", err);
        }
    }

    static async loadupdatedAt(user_handle) {

        try {
            const [rows] = await conection.execute(
                "SELECT updated_at FROM users WHERE user_handle = ?",
                [user_handle]
            );
            return rows[0]?.updated_at || null;

        } catch (err) {
            console.log("Error loading updatedat in class LoadUserData.js => ", err);
        }       
    }

    static async loadadminStatus(user_handle) {

        try {
            const [rows] = await conection.execute(
                "SELECT admin_status FROM users WHERE user_handle = ?",
                [user_handle]
            );
            return rows[0]?.admin_status || null;

        } catch (err) {
            console.log("Error loading admin_status in class LoadUserData.js => ", err);
        }            
    }

    static async loadAll(user_handle) {
        try {

            const [rows] = await conection.execute(
                "SELECT user_handle, first_name, phonenumber, last_name, email_address, university, bio, profile_picture, created_at, updated_at, admin_status FROM users WHERE user_handle = ?",
                [user_handle]
            );

            if (rows.length === 0) {
                console.log("No user found with that username");
                return null;
            }

            return rows[0];

        } catch (err) {
            console.log("Error while loading data fromn user, in class LoadUserData");
            console.log(err);
        }
    }



}



