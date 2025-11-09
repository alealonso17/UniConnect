//---------------------------------------------
//---------------------------------------------
// JS FILE FOR ANIMATIONS , HOVERS ...
//---------------------------------------------
//---------------------------------------------


//constants 
const PostBtn = document.getElementById("postButton");
const PostBorder = document.getElementById("borderEffect");
const PostIcon = document.getElementById("postIcon");


if (PostBtn && PostBorder && PostIcon) {
  PostBtn.addEventListener("mouseenter", () => {
    // Animación del borde
    PostBorder.classList.add("opacity-100", "spinOnce");

    // Reinicia la vibración del icono
    PostIcon.classList.remove("tiltOnce");
    void PostIcon.offsetWidth; // Reinicia animación CSS
    PostIcon.classList.add("tiltOnce");
  });

  PostBtn.addEventListener("animationend", (e) => {
    if (e.animationName === "spinBorderOnce") {
      PostBorder.classList.remove("spinOnce");
    }
  });

  PostBtn.addEventListener("mouseleave", () => {
    PostBorder.classList.remove("opacity-100");
  });

};