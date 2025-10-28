//----------------------------------------------
//----------------------------------------------
//Class for showing the error when someone registers or log ins , like the username too short , email alredy in use...
//----------------------------------------------
//----------------------------------------------




export class AuthErrorDisplay{
    
    static ErrorFrom(msg, id){

        const input = document.getElementById(id);
        const label = document.querySelector(`label[for="${id}"]`); 



        //Remove previous styles for error perevention and add the new ones
        input.classList.remove('focus:ring-2', 'focus:ring-[#7746e1]'); 
        input.classList.add('ring', 'ring-red-500');

        //Delete the previous error incase there was one 
        const oldError = label.querySelector('.error-msg'); 
        oldError ? oldError.remove() : ''; 

        // create an span msg beside 
        const errorSpan = document.createElement('span'); 
        errorSpan.textContent = msg; 
        errorSpan.className = 'error-msg text-red-500 text-sm ml-2'; 

        label.insertAdjacentElement('beforeend', errorSpan);
    }
}