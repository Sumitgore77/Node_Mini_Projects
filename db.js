const mysql = require("mysql2");
const conn = mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        password: "root",
        database:"studapp"
    }
)
conn.connect((err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log("db connected");
})

module.exports = conn;