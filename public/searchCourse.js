let s = document.getElementById("searchInput")
s.addEventListener("keyup", ()=>{
    // alert(s.value);
    let request = new XMLHttpRequest();
    request.open("get",`/search?searchVal=${s.value}`,true);
    request.onreadystatechange = ()=>{
        if(request.readyState == 4 && request.status == 200){
            document.getElementById("viewTableBodyId").innerHTML = request.responseText;
        }
    }
    request.send();
});

// OR: Use this inside a regular function:
// request.onreadystatechange = ()=>{
//     if(this.readyState == 4 && this.status == 200){
//          -----;
//     }
// }
// Using this.readyState inside an arrow function (() => {}) does not refer to the XMLHttpRequest object — it refers to the outer lexical context, which is likely window or something else.
// Style	           this works?	Best Practice
// Arrow function =>   No	        Use- request.readyState
// Regular function	   Yes	        Can- use this.readyState