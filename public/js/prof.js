
var facultyForm = document.querySelector("form");



// facultyForm.addEventListener("submit", function () {
//     var coursCode = document.querySelector("#coursecode").value;
//     var ugPg = document.querySelector("#ugpg").value;
//     var electiveCore = document.querySelector("#elective").value;
//     var needToAttend = document.querySelector("#needto").value;
//     var nof = document.querySelector("#nof").value;
//     var theoryLab = document.querySelector("#theorylab").value;
//     var taRollNumber1 = document.querySelector("#prefta1").value;
//     var taRollNumber2 = document.querySelector("#prefta2").value;
//     var taRollNumber3 = document.querySelector("#prefta3").value;


//     var data = {
//         "courseCode": coursCode,
//         "ugPg": ugPg,
//         "electiveCore": electiveCore,
//         "needToAttend": needToAttend,
//         "nof": nof,
//         "theoryLab": theoryLab,
//         "taRollNumber1": taRollNumber1,
//         "taRollNumber2": taRollNumber2,
//         "taRollNumber3": taRollNumber3
//     }
//     var url = '/profdetails';
//     fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data)
//     }).then((response) => {
//         response.json().then((data) => {
//             if (data.error) {
//                 messageLoc.textContent = data.error;
//             } else {
//                 console.log(data.coursCode);
//                 console.log(data.ugpg);
//             }
//         });
//     });
// });


facultyForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var coursCode = document.querySelector("#coursecode").value;
    var ugPg = document.querySelector("#ugpg").value;
    var cgpa = document.querySelector("#cgpa").value;
    var electiveCore = document.querySelector("#elective").value;
    var needToAttend = document.querySelector("#needto").value;
    var nof = document.querySelector("#nof").value;
    var theoryLab = document.querySelector("#theorylab").value;
    var taRollNumber1 = document.querySelector("#prefta1").value;
    var taRollNumber2 = document.querySelector("#prefta2").value;
    var taRollNumber3 = document.querySelector("#prefta3").value;
    var password = document.querySelector('#password').value;
    
    var data = {
        "id": coursCode,
        "password": password
    }
    var url = '/checkpasswordprof';
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
                console.log(data.check);
                if (data.check == "yes") {


                    var data = {
                        "courseCode": coursCode,
                        "ugPg": ugPg,
                        //added on 19 sept.
                        "cgpa": cgpa,
                        "electiveCore": electiveCore,
                        "needToAttend": needToAttend,
                        "nof": nof,
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
                }
            }
        });
    });


    facultyForm.reset();
});
