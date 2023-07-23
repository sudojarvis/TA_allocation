const facultyForm = document.querySelector("form");
const messageLoc = document.querySelector("#message");
// const bcrypt = require('bcryptjs');
// const hbs = require('hbs');

function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var showPasswordCheckbox = document.getElementById("showPassword");
    var showPasswordLabel = document.getElementById("showPasswordLabel");
  
    if (showPasswordCheckbox.checked) {
      passwordInput.type = "text";
      showPasswordLabel.textContent = "Hide Password";
    } else {
      passwordInput.type = "password";
      showPasswordLabel.textContent = "Show Password";
    }
  }



facultyForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    var courseCode = document.querySelector("#coursecode").value;
    var courseName = document.querySelector("#coursename").value;
    var instructorName = document.querySelector("#instructorname").value;
    var ugPg = document.querySelector("#ugpg").value;
    var electiveCore = document.querySelector("#elective").value;
    var needToAttend = document.querySelector("#needto").value;
    var nof = document.querySelector("#nof").value;
    var courseGrade = document.querySelector("#courseGrade").value;
    var theoryLab = document.querySelector("#theorylab").value;
    var taRollNumber1 = document.querySelector("#prefta1").value;
    var taRollNumber2 = document.querySelector("#prefta2").value;
    var taRollNumber3 = document.querySelector("#prefta3").value;
    var password = document.querySelector('#password').value;

    try {
        // const hashedPassword = await bcrypt.hash(password, 10);
        var data = {
            "courseCode": courseCode,
            "courseName": courseName,
            "instructorName": instructorName,
            "ugPg": ugPg,
            "electiveCore": electiveCore,
            "needToAttend": needToAttend,
            "nof": nof,
            "courseGrade": courseGrade,
            "theoryLab": theoryLab,
            "taRollNumber1": taRollNumber1,
            "taRollNumber2": taRollNumber2,
            "taRollNumber3": taRollNumber3,
            "password": password,
        };

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
                    console.log(data.courseCode);
                    console.log(data.ugPg);
                }
            });
        });

        facultyForm.reset();
    } catch (err) {
        console.error('Error hashing password:', err);
    }
});
