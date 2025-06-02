let btn = document.getElementById("searchStudent");
btn.addEventListener("keyup",()=>{
    let studName = btn.value;
    // alert(btn.value)
    let req = new XMLHttpRequest();                             //1
    req.open("get",`/searchSud?studName=${studName}`,true);     //2
    req.onreadystatechange = function(params) {                 //4
        if(this.readyState === 4 && this.status === 200){
            document.getElementById("studTableBody").innerHTML = this.responseText;
        }
    }
    req.send();                                                 //3
})













