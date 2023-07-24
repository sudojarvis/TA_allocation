var passwordInput = document.getElementById("password");
var showPasswordCheckbox = document.getElementById("showPassword");
var showPasswordLabel = document.getElementById("showPasswordLabel");


function togglePasswordVisibility() {
    if (showPasswordCheckbox.checked) {
      passwordInput.type = "text";
      showPasswordLabel.textContent = "Hide Password";
    } else {
      passwordInput.type = "password";
      showPasswordLabel.textContent = "Show Password";
    }

    // passwordInput.type = "password";

}


const isUgStudentCheckbox = document.getElementById("isUgStudent");
const cgpaInput = document.getElementById("cgpa");
const cgpaError = document.getElementById("cgpaError");
const cgpaContainer = document.getElementById("cgpa-container");

const course_grade_pref_1 = document.getElementById("course_grade_pref_1_container");
const course_grad_pref_select_1 = document.getElementById("course_grade_pref_1");

const course_grade_pref_2 = document.getElementById("course_grade_pref_2_container");
const course_grad_pref_select_2 = document.getElementById("course_grade_pref_2");

const course_grade_pref_3 = document.getElementById("course_grade_pref_3_container");
const course_grad_pref_select_3 = document.getElementById("course_grade_pref_3");

// Event listener for CGPA input validation
cgpaInput.addEventListener("input", function () {
  const cgpaValue = parseFloat(cgpaInput.value);

  if (isNaN(cgpaValue)) {
    cgpaError.textContent = "Enter valid CGPA";
  } else if (cgpaValue < 8 || cgpaValue > 10) {
    cgpaError.textContent = "CGPA should be between 8 and 10 inclusive";
  } else {
    cgpaError.textContent = "";
  }
});

// Event listener for isUgStudentCheckbox
isUgStudentCheckbox.addEventListener("change", function () {
  if (isUgStudentCheckbox.checked) {
    cgpaContainer.style.display = "block";
    cgpaInput.required = true;

    course_grade_pref_1.style.display = "block";
    course_grad_pref_select_1.required = true;

    course_grade_pref_2.style.display = "block";
    course_grad_pref_select_2.required = true;

    course_grade_pref_3.style.display = "block";
    course_grad_pref_select_3.required = true;
  } else {
    cgpaContainer.style.display = "none";
    cgpaInput.required = false;

    course_grade_pref_1.style.display = "none";
    course_grad_pref_select_1.required = false;

    course_grade_pref_2.style.display = "none";
    course_grad_pref_select_2.required = false;

    course_grade_pref_3.style.display = "none";
    course_grad_pref_select_3.required = false;
  }
});

function unchecked() {
    isUgStudentCheckbox.checked = false;
    cgpaContainer.style.display = "none";
    cgpaInput.required = false;
    course_grade_pref_1.style.display = "none";
    course_grade_pref_2.style.display = "none";
    course_grade_pref_3.style.display = "none";
    course_grad_pref_select_1.required = false;
    course_grad_pref_select_2.required = false;
    course_grad_pref_select_3.required = false;
}

function resetPassword() {
    passwordInput.type = "password";
    showPasswordCheckbox.checked = false;
    showPasswordLabel.textContent = "Show Password";
}



function submitForm() {
    const rollNumber = document.querySelector("#rollNumber").value;
    const cgpa = document.querySelector("#cgpa").value;
    const pref1 = document.querySelector("#pref1").value;
    const course_grade_pref_1 = document.querySelector("#course_grade_pref_1").value;
    const pref2 = document.querySelector("#pref2").value;
    const course_grade_pref_2 = document.querySelector("#course_grade_pref_2").value;
    const pref3 = document.querySelector("#pref3").value;
    const course_grade_pref_3 = document.querySelector("#course_grade_pref_3").value;
    const password = document.querySelector("#password").value;
  
    const data = {
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
  
    // Your fetch code here...

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
                // togglePasswordVisibility();
                unchecked();
                facultyForm.reset();
                
               
                // isUgStudentCheckbox.checked = false;
                // cgpaContainer.style.display = "none";
                // cgpaInput.required = false;
                // course_grade_pref_1.style.display = "none";
                // course_grad_pref_select_1.required = false;

                // course_grade_pref_2.style.display = "none";
                // course_grad_pref_select_2.required = false;

                // course_grade_pref_3.style.display = "none";
                // course_grad_pref_select_3.required = false;
            }
        });
    })
    .catch((error) => {
        console.error(error);
    }
    );

  }


var facultyForm = document.querySelector("form");
facultyForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (isUgStudentCheckbox.checked) {
    const cgpaValue = parseFloat(cgpaInput.value);

    if (isNaN(cgpaValue) || cgpaValue < 8 || cgpaValue > 10) {
      cgpaError.textContent = "Please enter a valid CGPA between 8 and 10";
      return;
    } else {
      cgpaError.textContent = "";
    }
  }

  submitForm();
  unchecked();
  resetPassword();
  // togglePasswordVisibility()
  // passwordInput.type = "password";
  // showPasswordCheckbox.checked = false;
  // showPasswordLabel.textContent = "Show Password";
  // facultyForm.reset();
  

});




























// var facultyForm = document.querySelector("form");

// facultyForm.addEventListener("submit", function (e) {
//     e.preventDefault();

//     // const cgpaValue = parseFloat(cgpaInput.value);

//     var data = {};

//     // if(isUgStudentCheckbox.checked) {

//     var rollNumber = document.querySelector("#rollNumber").value;
//     var cgpa = document.querySelector("#cgpa").value;
//     var pref1 = document.querySelector("#pref1").value;
//     var course_grade_pref_1 = document.querySelector("#course_grade_pref_1").value;
//     var pref2 = document.querySelector("#pref2").value;
//     var course_grade_pref_2 = document.querySelector("#course_grade_pref_2").value;
//     var pref3 = document.querySelector("#pref3").value;
//     var course_grade_pref_3 = document.querySelector("#course_grade_pref_3").value;
//     var password = document.querySelector("#password").value;

//     var data = {
//         "rollNumber": rollNumber,
//         "cgpa": cgpa,
//         "pref1": pref1,
//         "course_grade_pref_1": course_grade_pref_1,
//         "pref2": pref2,
//         "course_grade_pref_2": course_grade_pref_2,
//         "pref3": pref3,
//         "course_grade_pref_3": course_grade_pref_3,
//         "password": password
//     };


//     if(isUgStudentCheckbox.checked) {
//         var cgpaValue = parseFloat(cgpaInput.value);
//         if(isNaN(cgpaValue)){
//             cgpaError.textContent = "should be a valid CGPA";
//         }
//         else if( cgpaValue<8 || cgpaValue>10){
//             cgpaError.textContent = "CGPA should be between 8 and 10 inclusive";
//         }
//         else{
//             cgpaError.textContent = "";

        
//             var url = '/tadetails';
//             fetch(url, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data)
//             }).then((response) => {
//                 response.json().then((data) => {
//                     if (data.error) {
//                         console.error(data.error);
//                     } else {
//                         console.log(data.rollNumber);
//                         console.log(data.pref1);
//                     }
//                 });
//             });
            
//             facultyForm.reset();
//             togglePasswordVisibility();

//             isUgStudentCheckbox.addEventListener("change", function () {
//                 if (isUgStudentCheckbox.checked) {
//                     cgpaContainer.style.display = "none";
//                     cgpaInput.required = false;
            
//                     course_grade_pref_1.style.display = "none";
//                     course_grad_pref_select_1.required = false;
            
//                     course_grade_pref_2.style.display = "none";
//                     course_grad_pref_select_2.required = false;
            
//                     course_grade_pref_3.style.display = "none";
//                     course_grad_pref_select_3.required = false;
             
//                 }
//             });
//         }
//     }
//     else {
    
//         var url = '/tadetails';
//         fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(data)
//         }).then((response) => {
//             response.json().then((data) => {
//                 if (data.error) {
//                     console.error(data.error);
//                 } else {
//                     console.log(data.rollNumber);
//                     console.log(data.pref1);
//                 }
//             });
//         });
//         facultyForm.reset();
//         togglePasswordVisibility();
//     }

// });
