// ---------------------------------------------
// DisplaySuccessBox.js
// Universal success confirmation popup
// ---------------------------------------------


export class DisplaySuccessBox {

    static show(message) {

        //CREATE THE DIV  => MAKE THE BUTTON WORK 

        //1. CREATE THE DIV 
        const overlay = document.createElement("div");
        overlay.className = "fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[100]";

        // Create popup content
        overlay.innerHTML = /*html*/ `
            <div class="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 animate-fadeIn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <p class="text-lg font-semibold text-gray-700 text-center">${message}</p>
                <button id="successBoxButton" class="bg-[#5b67ca] text-white px-4 py-2 rounded-xl hover:bg-[#4a54b3] transition-all duration-150">
                    OK
                </button>
            </div>
        `;
        
        document.body.appendChild(overlay); 

        //2. button logic 
        const successBoxButton = document.getElementById("successBoxButton"); 

        successBoxButton.addEventListener('click', () => {
            location.reload(); //reload the page  
        }); 




    }
}