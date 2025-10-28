//----------------------------------------------
//----------------------------------------------
//Class for showing the error when someone registers or log ins , like the username too short , email alredy in use...
//----------------------------------------------
//----------------------------------------------




export class AuthErrorDisplay{
    
    static ErrorFrom(msg, id){

        const input = document.getElementById(id);
        const label = document.querySelector(`label[for="${id}"]`); 
        const errorId = `error-${id}`; // unique id for the error span 



        //Remove previous styles for error perevention and add the new ones
        input.classList.remove('focus:ring-2', 'focus:ring-[#7746e1]'); 
        input.classList.add('ring', 'ring-red-500');


        // create an span msg  beside 
        const errorSpan = document.createElement('span'); 
        errorSpan.id = errorId; 
        errorSpan.textContent = msg; 
        errorSpan.className = 'text-red-500 text-sm ml-2';
         

        label.insertAdjacentElement('beforeend', errorSpan);
    }

    static ErrorReset(){

        const registerForm = document.getElementById("registerForm");  //get the form and the imputs inside 
        const inputs = registerForm.querySelectorAll("input"); 

        inputs.forEach(input => { // cheack each import remove the red style and span messages if have
        input.classList.remove('ring', 'ring-red-500');
        input.classList.add('focus:ring-2', 'focus:ring-[#7746e1]');

        const errorSpan = document.getElementById(`error-${input.id}`);
        if (errorSpan) errorSpan.remove();
        });
    }
}