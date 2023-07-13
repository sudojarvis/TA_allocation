const { json } = require("body-parser");
const res = require("express/lib/response");

const XLSX = require("xlsx");

function allotment(prof, ta) {
    const matching = [];
    // const professorAssigned = {};
    const taAssigned = {};


  function checkCourseGrade(a, b) {
    const courseGrade = ['f', 'e-', 'e', 'd-', 'd', 'c-', 'c', 'b-', 'b', 'a-', 'a'];
    if (courseGrade.indexOf(a) >= courseGrade.indexOf(b)) {
      return true;
    } else {
      return false;
    }
  }

  function sortOnGrade(temp) {
    let i = 0;
    while (i < temp.length) {
        const currentCGPA = temp[i].cgpa;
        let j = i + 1;
        while (j < temp.length && temp[j].cgpa === currentCGPA) {
            j++;
        }

        const temp1 = temp.slice(i, j);
        temp1.sort((a, b) => {
            const courseGradeOrder = ['f', 'e-', 'e', 'd-', 'd', 'c-', 'c', 'b-', 'b', 'a-', 'a'];
            return courseGradeOrder.indexOf(b.courseGrade) - courseGradeOrder.indexOf(a.courseGrade);
        });

        temp.splice(i, temp1.length, ...temp1);
        i = j;
     }
  }

  const professors = prof.map(p => {
    const preferences = [
      { taRollNumber: p.taRollNumber1, weight: 3 },
      { taRollNumber: p.taRollNumber2, weight: 2 },
      { taRollNumber: p.taRollNumber3, weight: 1 }
    ];
  
    let count = 0;
    if (p.taRollNumber1 == '' || p.taRollNumber1 == undefined) {
      count++;
    }
    if (p.taRollNumber2 == '' || p.taRollNumber2 == undefined) {
      count++;
    }
    if (p.taRollNumber3 == '' || p.taRollNumber3 == undefined) {
      count++;
    }
  
    return {
      courseCode: p.courseCode,
      preferences,
      theoryLab: p.theoryLab,
      noOfStudents: p.nof,
      cgpa: p.cgpa,
      courseGrade: p.courseGrade,
      instructor: p.instructorName,
      courseName: p.courseName,
      prefFilled: count
    };
  });

  console.log(professors);
  

  const tas = ta.map(t => ({
    rollNumber: t.rollNumber,
    preferences: [
      { courseCode: t.pref1, courseGrade: t.course_grade_pref_1 , weight: 3},
      { courseCode: t.pref2, courseGrade: t.course_grade_pref_2, weight: 2 },
      { courseCode: t.pref3, courseGrade: t.course_grade_pref_3, weight: 1 }
    ],
    cgpa: t.cgpa,
  })
  );


      
 

  var presentYear = new Date().getFullYear();
  lastTwoDigits = presentYear%100;

  const arrOfyears = [];

  for(let i=-5;i<=5;i++){
    arrOfyears.push(lastTwoDigits+i);
  }

  const tempArrBt=arrOfyears.map((num)=>'b'+num); // creating an array of batch tag for btech
  const tempArrMt=arrOfyears.map((num)=>'m'+num); // creating an array of batch tag for mtech
  const tempArrPh=arrOfyears.map((num)=>'p'+num); // creating an array of batch tag for phd

  const pgBatchTag = [...tempArrMt,...tempArrPh]; // creating an array of batch tag for pg
  const ugBatchTag = [...tempArrBt]; // creating an array of batch tag for ug

  const ugTas = tas.filter(ta => ugBatchTag.includes(ta.rollNumber.slice(0, 3)));
  const pgTas = tas.filter(ta => pgBatchTag.includes(ta.rollNumber.slice(0, 3)));

  // console.log(ugTas);
  // console.log(pgTas);
  const taAssignedBatchTag = {};

  function specificallyChosenByOtherProf(taRollNumber, courseCode) {
    for (var prof of professors) {
      if (prof.courseCode !== courseCode) {
        if (prof.preferences.some(pref => pref.taRollNumber === taRollNumber && isAlsoChosenByTa(taRollNumber, prof.courseCode))) {
          return true; // Return true if the TA is specifically chosen by another professor for a different course
        }
      }
    }
    return false; // Return false if the TA is not specifically chosen by any other professor for a different course
  }
  
  function isAlsoChosenByTa(taRollNumber, courseCode) {
    const ta = tas.find(ta => ta.rollNumber === taRollNumber);
    if (ta) {
      return ta.preferences.some(pref => pref.courseCode === courseCode);
    }
    return false;
  }
  

  // function checkWeight(professors, taRollNumber, excludeCourseCode, weight) {
  //   for (var prof of professors) {
  //     if (prof.courseCode !== excludeCourseCode) {
        
  //       if (prof.preferences.some(pref => pref.taRollNumber === taRollNumber && pref.weight > weight)) {
  //         cons
  //         console.log(prof.courseCode)
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }
  function checkWeight(professors, taRollNumber, excludeCourseCode, weight) {
    for (var prof of professors) {
      if (prof.courseCode !== excludeCourseCode) {
        if (prof.preferences.some(pref => pref.taRollNumber === taRollNumber && pref.weight > weight)) {
          return true;
        }
      }
    }
    return false;
  }
  
  
  

  professors.forEach(professor => {
    const studentPerTA = professor.theoryLab === "theory" ? 30 : 15;  // 30 for theory and 15 for lab
    var noOftasRequired = Math.ceil(professor.noOfStudents / studentPerTA);

    matching.push({
      courseCode: professor.courseCode,
      instructor: professor.instructor,
      courseName: professor.courseName,
      expertTa: [],
    });


   
    for (var pref of professor.preferences) {

      var profTaRollNumber= pref.taRollNumber;
      var weight = pref.weight;

      var batchTag = false;
      if (ugBatchTag.includes(profTaRollNumber) || pgBatchTag.includes(profTaRollNumber)) {
        batchTag = true;
      }
    
      if (batchTag) {

        // console.log(batchTag);

        if (pgBatchTag.includes(profTaRollNumber)) {

          var tempTa = pgTas.filter(ta => ta.rollNumber.slice(0, 3) === profTaRollNumber && !specificallyChosenByOtherProf(ta.rollNumber, professor.courseCode));
          var taPref1 = tempTa.filter(ta => ta.preferences[0].courseCode === professor.courseCode && matching.find(m => m.courseCode === professor.courseCode).expertTa.indexOf(ta.rollNumber) === -1);
          var taPref2 = tempTa.filter(ta => ta.preferences[1].courseCode === professor.courseCode && matching.find(m => m.courseCode === professor.courseCode).expertTa.indexOf(ta.rollNumber) === -1);
          var taPref3 = tempTa.filter(ta => ta.preferences[2].courseCode === professor.courseCode && matching.find(m => m.courseCode === professor.courseCode).expertTa.indexOf(ta.rollNumber) === -1);
          var taPref = [...taPref1, ...taPref2, ...taPref3];
    

          if(taPref.length===0){
            continue;
          }


          for(let i=0;i<taPref.length;i++){
          
            if(!taAssigned[taPref[i].rollNumber]){

              matching.find(m => m.courseCode === professor.courseCode).expertTa.push(taPref[i].rollNumber);
              noOftasRequired--;
              taAssigned[taPref[i].rollNumber]=true;
              break;
            }
          }

        }
        else if (ugBatchTag.includes(profTaRollNumber)){
          // console.log(ugBatchTag.includes(profTaRollNumber));
          var tempTa = ugTas.filter(ta => ta.rollNumber.slice(0, 3) === profTaRollNumber && !specificallyChosenByOtherProf(ta.rollNumber, professor.courseCode) && taAssignedBatchTag[ta.rollNumber]!==true);
          // console.log("tempTa", tempTa);

          // console.log("tempTa", tempTa);
          var taPref1 = tempTa.filter(ta => ta.preferences[0].courseCode === professor.courseCode && matching.find(m => m.courseCode === professor.courseCode).expertTa.indexOf(ta.rollNumber) === -1 && checkCourseGrade(ta.preferences[0].courseGrade, professor.courseGrade)); // && !specifcallyChosenByOtherProf(ta.rollNumber, professor.courseCode));
          // console.log("taPref1", taPref1);
          var taPref2 = tempTa.filter(ta => ta.preferences[1].courseCode === professor.courseCode && matching.find(m => m.courseCode === professor.courseCode).expertTa.indexOf(ta.rollNumber) === -1 && checkCourseGrade(ta.preferences[1].courseGrade, professor.courseGrade));// && !specifcallyChosenByOtherProf(ta.rollNumber, professor.courseCode));
          // console.log("taPref2", taPref2);
          var taPref3 = tempTa.filter(ta => ta.preferences[2].courseCode === professor.courseCode && matching.find(m => m.courseCode === professor.courseCode).expertTa.indexOf(ta.rollNumber) === -1 && checkCourseGrade(ta.preferences[2].courseGrade, professor.courseGrade)); //&& !specifcallyChosenByOtherProf(ta.rollNumber, professor.courseCode));
          // console.log("taPref3", taPref3);
          // var taPref = [...taPref1, ...taPref2, ...taPref3];

          var tempTA0= [];
          var tempTA1= [];
          var tempTA2= [];
          for(var ta of taPref1){
            tempTA0.push({
              rollNumber:ta.rollNumber,
              cgpa:ta.cgpa,
              courseCode:ta.preferences[0].courseCode,
              courseGrade:ta.preferences[0].courseGrade
            })
          }

          for(var ta of taPref2){
            tempTA1.push({
              rollNumber:ta.rollNumber,
              cgpa:ta.cgpa,
              courseCode:ta.preferences[0].courseCode,
              courseGrade:ta.preferences[0].courseGrade
            })
          }

          for(var ta of taPref2){
            tempTA2.push({
              rollNumber:ta.rollNumber,
              cgpa:ta.cgpa,
              courseCode:ta.preferences[0].courseCode,
              courseGrade:ta.preferences[0].courseGrade
            })
          }

          var taPref = [...tempTA0, ...tempTA1, ...tempTA2];

          taPref.sort((a, b) => b.cgpa - a.cgpa);
          sortOnGrade(taPref);

  
          // console.log("taPref", taPref);
          // console.log("taPref", taPref);
          // sortOnGrade(taPref);

          if(taPref.length===0){
            continue;
          }

          // if(!taAssigned[taPref[0].rollNumber]){
          //   matching.find(m => m.courseCode === professor.courseCode).expertTa.push(taPref[0].rollNumber);
          //   noOftasRequired--;
          //   taAssigned[taPref[0].rollNumber]=true;
          // }
          for(let i=0;i<taPref.length;i++){
            if(!taAssigned[taPref[i].rollNumber]){
              matching.find(m => m.courseCode === professor.courseCode).expertTa.push(taPref[i].rollNumber);
              noOftasRequired--;
              taAssigned[taPref[i].rollNumber]=true;
              taAssignedBatchTag[taPref[i].rollNumber]=true;
              break;
            }
          }
        }

      }
      else {
        const ta1 = tas.filter(ta => ta.preferences[0].courseCode === professor.courseCode && matching.find(m => m.courseCode === professor.courseCode).expertTa.indexOf(ta.rollNumber) === -1);
        // console.log("-------------------",ta1);
        const ta2 = tas.filter(ta => ta.preferences[1].courseCode === professor.courseCode && matching.find(m => m.courseCode === professor.courseCode).expertTa.indexOf(ta.rollNumber) === -1);

        const ta3 = tas.filter(ta => ta.preferences[2].courseCode === professor.courseCode && matching.find(m => m.courseCode === professor.courseCode).expertTa.indexOf(ta.rollNumber) === -1);

        const temp = [...ta1, ...ta2, ...ta3];
        // console.log("temp",temp);

        for(var ta of temp){
          if(ta.rollNumber === profTaRollNumber){
            // console.log("---------------------------------")
            var x = checkWeight(professors,ta.rollNumber,professor.courseCode,weight);
            // console.log("x",x);
            // console.log("======================================")

            if(!taAssigned[ta.rollNumber] && !x){
           
              matching.find(m => m.courseCode === professor.courseCode).expertTa.push(ta.rollNumber);
              noOftasRequired--;
              taAssigned[ta.rollNumber]=true;
            }
  
      

          }
        }

      }

      if(noOftasRequired===0){
        break;
      }
      
    }

    // if no of tas required is still not zero then assign pg students first to the course if available 

    if (noOftasRequired > 0 && professor.prefFilled===0) {
      var temp1= pgTas.filter(ta => ta.preferences[0].courseCode === professor.courseCode && matching.find(m => m.courseCode === professor.courseCode).expertTa.indexOf(ta.rollNumber) === -1);
      var temp2= pgTas.filter(ta => ta.preferences[1].courseCode === professor.courseCode && matching.find(m => m.courseCode === professor.courseCode).expertTa.indexOf(ta.rollNumber) === -1);
      var temp3= pgTas.filter(ta => ta.preferences[2].courseCode === professor.courseCode && matching.find(m => m.courseCode === professor.courseCode).expertTa.indexOf(ta.rollNumber) === -1);
      var temp = [...temp1, ...temp2, ...temp3];
      // console.log("temp",temp);
      for (var ta of temp) {
        if (!matching.find(m => m.courseCode === professor.courseCode).expertTa.includes(ta.rollNumber)) {

          if(!taAssigned[ta.rollNumber]){

            matching.find(m => m.courseCode === professor.courseCode).expertTa.push(ta.rollNumber);
            noOftasRequired--;
            taAssigned[ta.rollNumber]=true;
          }

        }
        if(noOftasRequired===0){
          break;
        }
      }
    }
          // if all pg students are over then assign ug students to the course
    if (noOftasRequired > 0 && professor.prefFilled===0) {
      var temp1 = ugTas.filter(ta => ta.preferences[0].courseCode === professor.courseCode && checkCourseGrade(ta.preferences[0].courseGrade, professor.courseGrade));
      var temp2 = ugTas.filter(ta => ta.preferences[1].courseCode === professor.courseCode && checkCourseGrade(ta.preferences[1].courseGrade, professor.courseGrade));
      var temp3 = ugTas.filter(ta => ta.preferences[2].courseCode === professor.courseCode && checkCourseGrade(ta.preferences[2].courseGrade, professor.courseGrade));

      const tempTA0=[];
      const tempTA1=[];
      const tempTA2=[];

      for(var ta of temp1){
        tempTA0.push({
          rollNumber:ta.rollNumber,
          cgpa:ta.cgpa,
          courseCode:ta.preferences[0].courseCode,
          courseGrade:ta.preferences[0].courseGrade
        })
      }
      for(var ta of temp2){
        tempTA1.push({
          rollNumber:ta.rollNumber,
          cgpa:ta.cgpa,
          courseCode:ta.preferences[1].courseCode,
          courseGrade:ta.preferences[1].courseGrade
        })
      }
      for(var ta of temp3){
        tempTA2.push({
          rollNumber:ta.rollNumber,
          cgpa:ta.cgpa,
          courseCode:ta.preferences[2].courseCode,
          courseGrade:ta.preferences[2].courseGrade
        })
      }


     var temp = [...tempTA0, ...tempTA1, ...tempTA2];

     temp = temp.filter(ta => !specificallyChosenByOtherProf(ta.rollNumber,professor.courseCode));
    
      // console.log("temp",temp);
      temp.sort((a, b) => b.cgpa - a.cgpa);
      sortOnGrade(temp);
      // console.log("temp", temp);
      for (var ta of temp) {
        // console.log("ta",ta);
        if (!matching.find(m => m.courseCode === professor.courseCode).expertTa.includes(ta.rollNumber)) {

          // console.log("ta",ta);
          if(!taAssigned[ta.rollNumber]){

            matching.find(m => m.courseCode === professor.courseCode).expertTa.push(ta.rollNumber);
            noOftasRequired--;
            taAssigned[ta.rollNumber]=true;
          }
        }
        if (noOftasRequired === 0) {
          break;
        }
      }
    }
    console.log("-------------------------------");
});


  
  jsonformated=[]

  for(const m of matching){
      jsonformated.push({
          "courseCode":m.courseCode.toString().toUpperCase(),
          "courseName":m.courseName.toString().toUpperCase(),
          "Instructor":m.instructor.toString().toUpperCase(),
          "expertTa":m.expertTa.toString().toUpperCase(),
          // "traineeTa":m.traineeTa.toString().toUpperCase()
      });
  }

  console.log("jsonformated",jsonformated);

    return jsonformated;
    // return matching;
};





module.exports = allotment;




// const prof =[
//   {
//     courseCode: 'eel1010',
//     courseName: 'design credit ee',
//     instructorName: 'ashish',
//     ugPg: 'ug',
//     electiveCore: 'core',
//     needToAttend: 0,
//     noOfStudents: 123,
//     theoryLab: 'theory',
//     courseGrade: 'a',
//     taRollNumber1: 'b20ee011',
//     taRollNumber2: 'b20ee111',
//     taRollNumber3: 'b20ee123'
//   },
//   {
//     courseCode: 'csl1010',
//     courseName: 'design credit cs',
//     instructorName: 'kumar',
//     ugPg: 'ug',
//     electiveCore: 'core',
//     needToAttend: 0,
//     noOfStudents: 140,
//     theoryLab: 'lab',
//     courseGrade: 'a',
//     taRollNumber1: 'b20cs011',
//     taRollNumber2: 'b20cs111',
//     taRollNumber3: 'b20cs123'
//   }
// ];

// const ta =[
//   {
//     rollNumber: 'eel1010',
//     pref1: 'eel1010',
//     course_grade_pref_1: 'a',
//     pref2: 'csl1010',
//     course_grade_pref_2: 'a',
//     pref3: 'eel1030',
//     course_grade_pref_3: 'a'
//   },
//   {
//     rollNumber: 'b20cs011',
//     pref1: 'csl1010',
//     course_grade_pref_1: 'a',
//     pref2: 'csl1020',
//     course_grade_pref_2: 'a',
//     pref3: 'csl1030',
//     course_grade_pref_3: 'a'
//   }
// ]

// result=allotment(prof,ta);
// console.log("----------------",result);





  // const prof = [
  //   {
  //   //   _id: new ObjectId("647b4dab37c4ac2be44b90b9"),
  //     courseCode: 'eel1010',
  //     courseName: 'design credit ee',
  //     instructorName: 'ashish',
  //     ugPg: 'ug',
  //     electiveCore: 'core',
  //     needToAttend: 0,
  //     nof: 123,
  //     theoryLab: 'theory',
  //     cgpa: 8,
  //     courseGrade: 'a-',
  //     // taRollNumber1: 'b20',
  //     // taRollNumber2: 'b20cs0111',
  //     // taRollNumber3: 'b20ee0124',
  //     taRollNumber1: 'b20ee011',
  //     taRollNumber2: 'b20cs011',
  //     taRollNumber3: 'b20ee123',
  //     __v: 0
  //   },
  //   {
  //   //   _id: new ObjectId("647b4f755e59c516bc8bec82"),
  //     courseCode: 'csl1010',
  //     ugPg: 'ug',
  //     courseName: 'design credit cs',
  //     instructorName: 'kumar',
  //     electiveCore: 'core',
  //     needToAttend: 0,
  //     nof: 123,
  //     theoryLab: 'theory',
  //     cgpa: 8,
  //     courseGrade: 'a',
  //     // taRollNumber1: 'b20ee011',
  //     // taRollNumber2: 'b20cs010',
  //     // taRollNumber3: 'b30cs000',
  //     taRollNumber1: 'b20cs011',
  //     taRollNumber2: 'b20cs111',
  //     taRollNumber3: 'b20cs123',
  //     __v: 0
  //   }
  // ];
  

  // const ta = [
  //   {
  //   //   _id: new ObjectId("647b4cfe37c4ac2be44b90b6"),
  //     rollNumber: 'b20ee011',
  //     cgpa: 9,
  //     pref1: 'eel1010',
  //     course_grade_pref_1: 'a-',
  //     pref2: 'eel1020',
  //     course_grade_pref_2: 'a',
  //     pref3: 'eel1030',
  //     course_grade_pref_3: 'a-',
  //     __v: 0
  //   },
  //   {
  //   //   _id: new ObjectId("647b4fc05e59c516bc8bec85"),
  //       rollNumber: 'b20cs011',
  //       cgpa: 9,
  //       pref1: 'csl1010',
  //       course_grade_pref_1: 'a',
  //       pref2: 'eel1010',
  //       course_grade_pref_2: 'a',
  //       pref3: 'eel1030',
  //       course_grade_pref_3: 'a-',
  //       __v: 0
  //   },
  //   {
  //   //   _id: new ObjectId("647b4fc05e59c516bc8bec85"),
        
  //       rollNumber: 'b20ee0125',
  //       cgpa: 9,
  //       pref1: 'eel1010',
  //       course_grade_pref_1: 'a',
  //       pref2: 'eel1020',
  //       course_grade_pref_2: 'a',
  //       pref3: 'eel1030',
  //       course_grade_pref_3: 'a-',
  //       __v: 0
  //   },
  //   {
  //   //   _id: new ObjectId("647b4fc05e59c516bc8bec85"),
  //   rollNumber: 'b20ee0126',
  //   cgpa: 9,
  //   pref1: 'eel1010',
  //   course_grade_pref_1: 'a',
  //   pref2: 'eel1020',
  //   course_grade_pref_2: 'a',
  //   pref3: 'eel1030',
  //   course_grade_pref_3: 'a-',
  //   __v: 0
  //   },
  //   {
  //   //   _id: new ObjectId("647b4fc05e59c516bc8bec85"),
  //   rollNumber: 'b20ee0127',
  //   cgpa: 9,
  //   pref1: 'csl1010',
  //   course_grade_pref_1: 'a',
  //   pref2: 'eel1020',
  //   course_grade_pref_2: 'a',
  //   pref3: 'eel1030',
  //   course_grade_pref_3: 'a-',
  //   __v: 0 
  //   },
  //   {
  //   //   _id: new ObjectId("647b4fc05e59c516bc8bec85"),
  //   rollNumber: 'b20cs111',
  //   cgpa: 9,
  //   pref1: 'eel1010',
  //   course_grade_pref_1: 'b',
  //   pref2: 'csl1010',
  //   course_grade_pref_2: 'a',
  //   pref3: 'eel1030',
  //   course_grade_pref_3: 'a-',
  //   __v: 0
  //   },


  // ];


  // result=allotment(prof,ta);
  // console.log(result);

// const XLSX = require('xlsx');





// const data = result;


// const workbook = XLSX.utils.book_new();
// const worksheet = XLSX.utils.json_to_sheet(data);
// XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
// XLSX.writeFile(workbook, 'output2.xlsx');

// const ExcelJS = require('exceljs');

// // const data = [
// //     {
// //       coursecode: "EEL1010",
// //       experta: "B20EE011,b20EE023,b20EE0111"
// //     },
// //     {
// //       coursecode: "EEL1020",
// //       experta: "B20EE012,B20EE024,B20EE0112"
// //     },
// //     {
// //       coursecode: "EEL1030",
// //       experta: "B20EE013,B20EE025,B20EE0113"
// //     }
// //   ];

// const data = result;
  
//   // Create a new workbook
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Sheet1');
  
//   // Set headers
//   worksheet.getCell(1, 1).value = 'course Code';
//   worksheet.getCell(1, 2).value = 'ExpertTa';
  
//   // Split the values and assign them to separate columns
//   data.forEach((item, index) => {
//     worksheet.getCell(index + 2, 1).value = item.courseCode;
  
//     const values = item.expertTa.split(',');
  
//     values.forEach((value, columnIndex) => {
//       worksheet.getCell(index + 2, columnIndex + 2).value = value;
//     });
//   });
  
//   // Save the workbook
//   workbook.xlsx.writeFile('output.xlsx')
//     .then(() => {
//       console.log('Excel file generated successfully.');
//     })
//     .catch((error) => {
//       console.log('Error generating Excel file:', error);
//     });
  

// const XlsxPopulate = require('xlsx-populate');
// Create a new workbook
// XlsxPopulate.fromBlankAsync().then(workbook => {
//   // Get the first sheet
//   const sheet = workbook.sheet(0);

//   // Set the headers
//   const headers = Object.keys(data[0]);
//   headers.forEach((header, index) => {
//     sheet.cell(1, index + 1).value(header);
//   });

//   // Set the data
//   data.forEach((item, rowIndex) => {
//     Object.entries(item).forEach(([key, value], columnIndex) => {
//       if (Array.isArray(value)) {
//         value.forEach((arrayValue, arrayIndex) => {
//           sheet.cell(rowIndex + 2 + arrayIndex, columnIndex + 1).value(arrayValue);
//         });
//       } else {
//         sheet.cell(rowIndex + 2, columnIndex + 1).value(value);
//       }
//     });
//   });

//   // Save the workbook to a file
//   return workbook.toFileAsync('output.xlsx');
// }).then(() => {
//   console.log('Excel file created successfully!');
// }).catch(error => {
//   console.error('Error:', error);
// });
