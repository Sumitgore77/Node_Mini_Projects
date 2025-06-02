let express = require("express");
let app =express();
app.use(express.static('public'));
let conn = require("./db");
const { render } = require("ejs");
app.use(express.urlencoded({ extended: true }));
const path = require('path');
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs')

//default first page
app.get("/", (req, res) => {
    res.render("index");
})

//set navbar
app.get("/home", (req, res) => {
    res.render("index");
})

// render course form 
app.get("/addCourse", (req, res) => {
    res.render("addCourse.ejs", { message: "" });
})

//add course
app.post("/save", (req, res) => {
    let sub = req.body.subject;
    conn.query("insert into courseSubData (cname) values (?)", [sub], (err, result) => {
        if (err) {
            console.log("Error at course insert Query")
            console.log(err);
            res.render('addCourse.ejs', {message: 'Course is Already Present.' });
            return;
        }
        res.render("addCourse.ejs", { message: `Data inserted successfully!` });
    });
})
//view course
app.get("/viewCourse", (req, res) => {
    let status = req.query.status;  //use for alert after update
    conn.query("select * from courseSubData", (err, result) => {
        if (err) {
            console.log("error in view course select Query");
            console.log(err);
        }
        // console.log(typeof(result));
        // console.log(result)
        res.render("viewCourse.ejs", { data: result, status });
    })
})
//search Course
app.get("/search", (req, res) => {
    // let searchVal = req.query.searchVal;
    let pattern = `%${req.query.searchVal}%`;
    // console.log(pattern);
    conn.query("select * from courseSubData where cname like ?", [pattern], (err, result) => {
        if (err) {
            console.log("error in search course select Query");
            console.log(err);
        }
        // console.log(result);
        res.render("viewCourseTableBody.ejs", { data: result });
    })
})
//delete course
app.get("/deleteCourse", (req, res) => {
    // console.log(req.query.cid);
    let cid = req.query.cid;
    conn.query("delete from courseSubData where cid = ?", [cid], (err, result) => {
        if (err) {
            console.log("error in delete course Query");
            console.log(err);
        }
    });
    res.redirect("viewCourse?status=deleted");
})
//use ajax on delete have to do it later

//featch update details
app.get("/updateCourse", (req, res) => {
    // console.log(req.query.cid)
    conn.query("Select * from courseSubData where cid =?", [req.query.cid], (err, result) => {
        if (err) {
            console.log("error in featch details for update course Query");
            console.log(err);
        }
        // res.send(result)
        res.render("updateCourse.ejs", { data: result });
    })
})
//update in table
app.post("/updateInTable", (req, res) => {
    let { cid, subject } = req.body;
    // res.send(cid)
    conn.query("update courseSubData set cname = ? where cid = ?", [subject, cid], (err, result) => {
        if (err) {
            console.log("error in update course Query");
            console.log(err);
        }
        res.redirect("viewCourse?status=updated")
    })
})

//add student
app.get("/addStud", (req, res) => {
    //send course data to addstud form
    conn.query("select * from courseSubData", (err, result) => {
        if (err) {
            console.log("error in selet course Query for add student on courseSubData");
            console.log(err);
        }
        res.render("addstudent.ejs", { data: result, message: "" })
    });
});
//save student to db table
app.post("/saveStud", (req, res) => {
    let { name, email, contact, subjectId } = req.body;
    conn.query("insert into studData(sname, email,contact,cid)values(?,?,?,?)", [name, email, contact, subjectId], (err, result) => {
        if (err) {
            console.log("error in insert student Query ");
            console.log(err);
        }
    })
    conn.query("select * from courseSubData", (err, result) => {
        if (err) {
            console.log("error in selet course Query for add student on courseSubData");
            console.log(err);
        }
        res.render("addstudent.ejs", { data: result, message: "Data inserted successfully!" })
    });
});

///viewStud 
app.get("/viewStud", (req, res) => {
    let msgStatus = req.query.msgStatus;           //for msg of delete and update
    conn.query("select s.sid,s.sname,s.email,s.contact,c.cname from courseSubData c  join studData s on s.cid = c.cid", (err, result) => {
        if (err) {
            console.log("error in select student Query for viewStud");
            console.log(err);
        }
        // console.log(result)
        res.render("viewStudent.ejs", { data: result, msgStatus });
    })
});

//update student
app.get("/updateStudent", (req, res) => {
    let studId = parseInt(req.query.sid.trim());
    conn.query("select s.sid,s.sname,s.email,s.contact,c.cname, c.cid from courseSubData c  join studData s on s.cid = c.cid where sid=?", [studId], (err, result) => {
        if (err) {
            console.log("error in /updateStudeny url db query");
            console.log(err);
        }
        // console.log(result)
        conn.query("select * from courseSubData", (err, cResult) => {
            if (err) {
                console.log("error in /updateStudeny url db query while selecting course data");
                console.log(err);
            }
            res.render("updateStudent", { data: result, courseData: cResult });
        })
    });
})
//saveUpdateStud info in db
app.post("/saveUpdateStud", (req, res) => {
    // console.log(req.body);
    let { studId, name, email, contact, subjectId } = req.body;
    conn.query("update studData set sname = ? , email = ?, contact = ? ,cid = ? where sid = ?", [name, email, contact, subjectId, studId], (err, result) => {
        if (err) {
            console.log("error in /saveUpdateStud url db query while updating stud data");
            console.log(err);
        }
        res.redirect("viewStud?msgStatus=Course updated successfully!")
    })
});

//delete using ajax
app.get("/deleteStudent", (req, res) => {
    let sid = req.query.sid;
    conn.query("delete from studData where sid =?", [sid], (err, result) => {
        if (err) {
            console.log("error in /deleteStudent url db query while deleting stud data");
            console.log(err);
        }
    })
    res.redirect("viewStud?msgStatus=Student delete successfully!");
})

//search student
app.get("/searchSud", (req, res) => {
    let val2 = req.query.studName;
    console.log(val2)

    let pattern2 = `%${val2}%`;
    console.log(pattern2)
    conn.query("select s.sid,s.sname,s.email,s.contact,c.cname, c.cid from courseSubData c  join studData s on s.cid = c.cid where sname like ? or email like ? or contact like ? or cname like ?", [pattern2, pattern2, pattern2, pattern2], (err, result) => {
        if (err) {
            console.log("error in /searchSud url db query while selecting stud data");
            console.log(err);
        }
        console.log(result);
        res.render("viewStudentTableBody.ejs", { data: result });
    });

})


//report------------
app.get("/report", (req, res) => {
    conn.query("select * from courseSubData", (err, result) => {
        if (err) {
            console.log("error in /report url db query while selecting course data");
            console.log(err);
        }
        res.render("report.ejs", { data: result, studData: "" })
    });
})

//show course wise data
app.get("/courseWiseStudents", (req, res) => {
    let courseName = req.query.courseName;
    // console.log(courseName)

    conn.query("select * from courseSubData", (err, result) => {
        if (err) {
            console.log("error in /report url db query while selecting course data");
            console.log(err);
        }
        console.log(result)
        conn.query("select s.sid,s.sname,s.email,s.contact,c.cname, c.cid from courseSubData c  join studData s on s.cid = c.cid where c.cid = ?", [courseName], (err, studResult) => {
            if (err) {
                console.log("error in /courseWiseStudents url db query while selecting student data");
                console.log(err);
            }
            res.render("report.ejs", { data: result, studData: studResult })
            console.log(studResult)
        })
    });

})
//Show course Wise Count of Student
app.get("/count", (req, res) => {
    const query = `SELECT c.cname AS cName,COUNT(s.sid) AS student_count FROM coursesubdata c LEFT JOIN studdata s ON c.cid = s.cid GROUP BY c.cname`;

    conn.query(query, (err, result) => {
        if (err) {
            console.error("Error in /count route query:", err);
            return res.status(500).send("Database error");
        }
        res.render("countStud.ejs", { studData: result });
    });
});



// <!-- <option value="<%= val.cid %>" <%= (val.cid == courseName) ? 'selected' : '' %> ><%= val.cname %></option> -->
//apply validations


app.listen(4000,() => {     // '192.168.111.192'
    
    console.log("Server Started!")
})