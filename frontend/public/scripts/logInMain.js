//We get the elements that we will use 
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerFormArticle');
const slider = document.getElementById('slider');
const loginSubmit = document.getElementById('loginSubmit');


//callback function => whenever login button gets the action 'click' execute function inline 
loginBtn.addEventListener('click', () => {

    //Move the slide to the left  (0%) 
    slider.style.transform = 'translateX(0%)';

    //Hide register form and show login form 
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    //Change the text color in boith log in and register button 
    loginBtn.classList.replace('text-[#6a6a6a]', 'text-[#2e2e2e]');
    registerBtn.classList.replace('text-[#2e2e2e]', 'text-[#6a6a6a]');


});

//callback function => whenever register button gets the action 'click' execute function inline 
registerBtn.addEventListener('click', () => {


    //Move the slider to the right 

    slider.style.transform = 'translateX(97%)';

    //Hide login form and show register form 
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");

    //Change the text color in both log in and register button 
    loginBtn.classList.replace('text-[#2e2e2e]', 'text-[#6a6a6a]');
    registerBtn.classList.replace('text-[#6a6a6a]', 'text-[#2e2e2e]');

});


//EventListener for submiting log in form 
loginSubmit.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href= "index.html" ; 
})