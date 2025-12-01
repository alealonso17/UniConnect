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
                `SELECT 
                user_handle, 
                first_name, 
                phonenumber, 
                last_name, 
                email_address, 
                university, 
                bio, 
                profile_picture, 
                created_at, 
                updated_at, 
                admin_status,

                -- 🟣 Nº de posts del usuario
                (SELECT COUNT(*) FROM posts 
                 WHERE posts.author_handle = users.user_handle) AS posts_count,

                -- 🟣 Nº de personas que SIGUE el usuario
                (SELECT COUNT(*) FROM follows 
                 WHERE follows.follower_handle = users.user_handle) AS following_count,

                -- 🟣 Nº de conexiones aceptadas
                (SELECT COUNT(*) FROM connections 
                 WHERE connections.user_handle = users.user_handle 
                   AND connections.status = 'accepted') AS connections_count

            FROM users
            WHERE user_handle = ?
            LIMIT 1`,
                [user_handle]
            );

            if (rows.length === 0) {
                console.log("No user found with that username");
                return null;
            }

            const userData = rows[0];

            // Default profile picture
            if (!userData.profile_picture) {
                userData.profile_picture = "https://res.cloudinary.com/dbepafbbt/image/upload/v1762718307/default_kgmcza.png";
            }

            // Default bio
            if (!userData.bio) {
                userData.bio = "Balancing deadlines, dreams, and friendships. Always curious about new technologies, people, and the stories behind them";
            }

            return userData;

        } catch (err) {
            console.log("❌ Error loading user data", err);
            return null;
        }
    }




}



