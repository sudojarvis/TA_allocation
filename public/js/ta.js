
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
  


var facultyForm = document.querySelector("form");

facultyForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var data = {};

    // if(isUgStudentCheckbox.checked) {

        var rollNumber = document.querySelector("#rollNumber").value;
        var cgpa = document.querySelector("#cgpa").value;
        var pref1 = document.querySelector("#pref1").value;
        var course_grade_pref_1 = document.querySelector("#course_grade_pref_1").value;
        var pref2 = document.querySelector("#pref2").value;
        var course_grade_pref_2 = document.querySelector("#course_grade_pref_2").value;
        var pref3 = document.querySelector("#pref3").value;
        var course_grade_pref_3 = document.querySelector("#course_grade_pref_3").value;
        var password = document.querySelector("#password").value;

        var data = {
            "rollNumber": rollNumber,
            "cgpa": cgpa,
            "pref1": pref1,
            "course_grade_pref_1": course_grade_pref_1,
            "pref2": pref2,
            "course_grade_pref_2": course_grade_pref_2,
            "pref3": pref3,
            "course_grade_pref_3": course_grade_pref_3,
            "password": password
        };
    // } else {

    //     var rollNumber = document.querySelector("#rollNumber").value;
    //     // var cgpa = document.querySelector("#cgpa").value;
    //     var pref1 = document.querySelector("#pref1").value;
    //     var pref2 = document.querySelector("#pref2").value;
    //     var pref3 = document.querySelector("#pref3").value;
    //     var password = document.querySelector("#password").value;

    //     var data = {
    //         "rollNumber": rollNumber,
    //         // "cgpa": cgpa,
    //         "pref1": pref1,
    //         "course_grade_pref_1": "NA",
    //         "pref2": pref2,
    //         "course_grade_pref_2": "NA",
    //         "pref3": pref3,
    //         "course_grade_pref_3": "NA",
    //         "password": password
    //     };
        
    // }
    
 

    var url = '/tadetails';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                console.error(data.error);
            } else {
                console.log(data.rollNumber);
                console.log(data.pref1);
            }
        });
    });


    facultyForm.reset();
});
