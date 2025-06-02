let msg =document.getElementById("msg2");
let input =document.querySelectorAll(".form-control");

input.forEach(element => {
    element.addEventListener("click",()=>{
        if(msg) msg.remove();
    })
});