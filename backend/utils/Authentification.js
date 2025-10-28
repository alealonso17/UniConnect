//---------------------------------------------
//---------------------------------------------
//AUTHENTIFICATION  CLASS FOR CHECKING INPUTS , AVOIDING SQL ERRORS AND LETTING USERS KNOW
//---------------------------------------------
//---------------------------------------------

export class Authentification {

    static  user_handleAuth(username){

        if(!username || typeof username != 'string' ) return {msg : "Username must be a string ", status : false }  ; 
        if(username.length < 3 ) return { msg : "Username too short ", status : false }; 
        if(username.length > 20 ) return {msg : "Username too long ", status :false}; 
        if(username.includes(" ")) return {msg :"Username must be with no spaces ", status : false}; 
        return {msg : '', status : true} ; 

    }

    static passwordAuth(password){

        if(password.length < 4) return {msg :"Password is too short ", status :false}; 
        if(password.includes(" ")) return {msg :"Password must be with no spaces ", status:false}; 
        return{msg :'', status : true}; 
        
    }

    static emailAuth(email){
        if (!email.length) return{msg :"email is empty", status: false}
    }

    
}