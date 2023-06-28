// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
// const document = dom.window.document;
var facultyForm = document.querySelector("form");
facultyForm.addEventListener("submit", function (e) {
    e.preventDefault();
    
    var coursCode = document.querySelector("#coursecode").value;
    var courseName = document.querySelector("#coursename").value;
    var instructorName = document.querySelector("#instructorname").value;
    var ugPg = document.querySelector("#ugpg").value;
    var electiveCore = document.querySelector("#elective").value;
    var needToAttend = document.querySelector("#needto").value;
    var nof = document.querySelector("#nof").value;
    // var cgpa=document.querySelector("#cgpa").value;
    var courseGrade=document.querySelector("#courseGrade").value;
    var theoryLab = document.querySelector("#theorylab").value;
    var taRollNumber1 = document.querySelector("#prefta1").value;
    var taRollNumber2 = document.querySelector("#prefta2").value;
    var taRollNumber3 = document.querySelector("#prefta3").value;
    var password = document.querySelector('#password').value;
    

    var data = {
        "id": coursCode,
        "password": password
    }
    // var url = '/checkpasswordprof';
    // fetch(url, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data)
    // }).then((response) => {
    //     response.json().then((data) => {
    //         if (data.error) {
    //             messageLoc.textContent = data.error;
    //         } else {
    //             console.log(data.check);
    //             if (data.check == "yes") {


                    var data = {
                        "courseCode": coursCode,
                        "courseName": courseName,
                        "instructorName": instructorName,
                        "ugPg": ugPg,
                        "electiveCore": electiveCore,
                        "needToAttend": needToAttend,
                        "nof": nof,
                        // "cgpa": cgpa,
                        "courseGrade": courseGrade,
                        "theoryLab": theoryLab,
                        "taRollNumber1": taRollNumber1,
                        "taRollNumber2": taRollNumber2,
                        "taRollNumber3": taRollNumber3
                    }
                    var url = '/profdetails';
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    }).then((response) => {
                        response.json().then((data) => {
                            if (data.error) {
                                messageLoc.textContent = data.error;
                            } else {
                                console.log(data.coursCode);
                                console.log(data.ugpg);
                            }
                        });
                    });
    //             }
    //         }
    //     });
    // });
    facultyForm.reset();
});
