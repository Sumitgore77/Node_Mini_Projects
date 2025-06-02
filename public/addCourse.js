//remove message on addcourseform

    let msg = document.getElementById("msg1");
    let input = document.getElementById("subjectName");
    input.addEventListener("click", () => {
        if (msg) msg.remove();
    }) 




