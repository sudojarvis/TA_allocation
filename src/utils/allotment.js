const { json } = require("body-parser");
const res = require("express/lib/response");

const XLSX = require("xlsx");

function allotment(prof, ta) {
    const matching = [];
    // const professorAssigned = {};
    const taAssigned = {};


  //function to check if ta course grade is greater than or equal to professor course grade
  function checkCourseGrade(a, b) {
    const courseGrade = ['f', 'e-', 'e', 'd-', 'd', 'c-', 'c', 'b-', 'b', 'a-', 'a'];
    if (courseGrade.indexOf(a) >= courseGrade.indexOf(b)) {
      return true;
    } else {
      return false;
    }
  }
  //////////////////////////////////////////////////////////////

  // below  within the same cgpa , sort ta according to course grade
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

  //////////////////////////////////////////////////////////////


  // return true if any ta has opted for the course
  // this function is used in findProfessorByTARollNumber
  function courseChosenByTa(taRollNumber,tas,courseCode){
    const ta = tas.find(ta => ta.rollNumber === taRollNumber);
    if(ta){
      return ta.preferences.some(preference => preference.courseCode === courseCode);

    }
    return false;
  }
  ///////////////////////////////////////////////////////////////

  // this filter ta if other professor opt for same ta for different courses and also ta also opt for same course

  function findProfessorByTARollNumber(professors, taRollNumber, excludedProfessor) {
    return professors.filter(professor => professor.courseCode !== excludedProfessor && courseChosenByTa(taRollNumber,tas,professor.courseCode));
  }
  ///////////////////////////////////////////////////////////////


    // reformating the professor and ta data
    const professors = prof.map(p => ({
      courseCode: p.courseCode,
      // preferences: [p.taRollNumber1, p.taRollNumber2, p.taRollNumber3],
      preferences: [{rollNumber:p.taRollNumber1,weight:3},{rollNumber:p.taRollNumber2,weight:2},{rollNumber:p.taRollNumber3,weight:1}],
    //   branch: p.branch,
      theoryLab: p.theoryLab,
      noOfStudents: p.nof,
      cgpa: p.cgpa,
      courseGrade: p.courseGrade,
      instructor: p.instructorName,
      courseName: p.courseName,
      // weigth: prof.indexOf(p)+1
    }));
    // console.log("professors",professors);

    // console.log("professors",professors);

    const tas = ta.map(t => ({
      rollNumber: t.rollNumber,
      preferences: [
        {courseCode: t.pref1, courseGrade: t.course_grade_pref_1,weight:3},
        {courseCode: t.pref2, courseGrade: t.course_grade_pref_2,weight:2},
        {courseCode: t.pref3, courseGrade: t.course_grade_pref_3,weight:1}
      ],
      cgpa: t.cgpa,
      upperCap: 4,
    }));

    ////////////////////////////////////////////////////////////////////

  
  professors.forEach(professor => {   /// iterating over all the professors
    const studentPerTA = professor.theoryLab === "theory" ? 30 : 15;  // 30 for theory and 15 for lab

    var noOfTaRequired = Math.ceil(professor.noOfStudents / studentPerTA);  // no of ta required for a professor
    // console.log("noOfTaRequired",noOfTaRequired);
    // matching.push({ courseCode: professor.courseCode, expertTa: [] });
    matching.push({ courseCode: professor.courseCode, instructor: professor.instructor, courseName: professor.courseName, expertTa: [] }); // adding course code and instructor name to matching array

    //filtering ta with same course code as professor
    const taWithSameCourse = tas.filter(ta =>
        ta.preferences.some(preference => preference.courseCode === professor.courseCode)
    );
    ///////////////////////////////////////////////////////////////////
   

    // ta1 stores ta with same course code as professor and first preference as professor course code
    // ta2 stores ta with same course code as professor and second preference as professor course code
    // ta3 stores ta with same course code as professor and third preference as professor course code
    const ta1 = taWithSameCourse.filter(ta => ta.preferences[0].courseCode === professor.courseCode && checkCourseGrade(ta.preferences[0].courseGrade, professor.courseGrade));
    const ta2 = taWithSameCourse.filter(ta => ta.preferences[1].courseCode === professor.courseCode && checkCourseGrade(ta.preferences[1].courseGrade, professor.courseGrade));
    const ta3 = taWithSameCourse.filter(ta => ta.preferences[2].courseCode === professor.courseCode && checkCourseGrade(ta.preferences[2].courseGrade, professor.courseGrade));
    /////////////////////////////////////////////////////////////////////////
    
    // reformating the filtered ta
    const ta1_=[];
    for(const ta of ta1){
        ta1_.push({
        rollNumber: ta.rollNumber,
        cgpa: ta.cgpa,
        courseGrade: ta.preferences[0].courseGrade,
        weight: ta.preferences[0].weight,
        upperCap: ta.upperCap,
    })
    }
    const ta2_=[];

    for(const ta of ta2){
        ta1_.push({
        rollNumber: ta.rollNumber,
        cgpa: ta.cgpa,
        courseGrade: ta.preferences[1].courseGrade,
        weight: ta.preferences[1].weight,
        upperCap: ta.upperCap,
    })
    }
    const ta3_=[];
    for (const ta of ta3) {
        ta1_.push({
        rollNumber: ta.rollNumber,
        cgpa: ta.cgpa,
        courseGrade: ta.preferences[2].courseGrade,
        weight: ta.preferences[2].weight,
        upperCap: ta.upperCap,
        });
    }
    /////////////////////////////////////////////////////////////////////////

    const temp = [...ta1_, ...ta2_, ...ta3_]; /// combining all the ta with same course code as professor

    temp.sort((a, b) => b.cgpa - a.cgpa); // sorting the ta in descending order of cgpa
    // console.log("temp",temp);
    // let i = 0;
    // console.log("temp before",temp);

    sortOnGrade(temp);  // sorting the ta on the basis of course grade

    ////////////////////////////////////////////////////////
    // creating the batch tag for ta
    presentYear=new Date().getFullYear();
    lastTwoDigitOfYr=presentYear%100;  // last two digit of year
    const arrOfYear=[];
    /// creating an array of last two digit of year and last two digit of year +2,+1,-1,-2,-3,-4
    for( var k =-4;k<=2;k++){
        arrOfYear.push(lastTwoDigitOfYr+k);
    }

    const tempArrBt=arrOfYear.map((num)=>'b'+num); // creating an array of batch tag for btech
    const tempArrMt=arrOfYear.map((num)=>'m'+num); // creating an array of batch tag for mtech
    const tempArrPh=arrOfYear.map((num)=>'p'+num); // creating an array of batch tag for phd

    const arrOfBatch=[...tempArrBt,...tempArrMt,...tempArrPh];  // combining all the batch tag


    for(const profTaRollNumber of professor.preferences){ // iterating over all the ta in professor preference

      const batchTag= arrOfBatch.includes(profTaRollNumber.rollNumber); // checking if the professor preference contains batch tag

      // console.log("batchTag",batchTag);
      // x= findProfessorByTARollNumber(professors,ta.rollNumber,professor.courseCode);
      if(!batchTag){  // if professor preference does not contain batch tag

        for( const ta of temp){   // iterating over all the ta with same course code as professor and sorted on cgpa and course grade (temp)
          if(!taAssigned[ta.rollNumber]){ // if ta is not assigned to any professor

            x= findProfessorByTARollNumber(professors,ta.rollNumber,professor.courseCode); // finding the other professor who has ta in his preference
            
            var chekWeight= true;

            ///////////////////////////////////////////////////////////
            /// checking if the ta is assigned to other professor and if the weight of ta in other professor preference is greater than the weight of ta in current professor preference

            if(x!==undefined && !taAssigned[ta.rollNumber]){
              x.forEach((pref)=>{
                pref.preferences.forEach((p)=>{
                  // console.log("p",p,"profTaRollNumber",profTaRollNumber,"weight",profTaRollNumber.weight);
                  if(p.rollNumber===ta.rollNumber && p.weight>profTaRollNumber.weight){
                    chekWeight=false;
                  }
                })
              })
            }
            ///////////////////////////////////////////////////////////


            
            if(ta.rollNumber === profTaRollNumber.rollNumber && noOfTaRequired>0 && (profTaRollNumber.weight>= ta.weight||ta.weight>=profTaRollNumber.weight) ){//&& chekWeight){ // if ta is same as professor preference and weight of ta is greater than or equal to weight of professor preference or vice versa
              
              // matching.find(m => m.courseCode === professor.courseCode).expertTa.push(profTaRollNumber.rollNumber);
             
              const matchingCourse = matching.find(m => m.courseCode === professor.courseCode); // finding the course in matching array
              
              if(matchingCourse && !matchingCourse.expertTa || !matchingCourse.expertTa.includes(profTaRollNumber.rollNumber)){ // if the course is not present in matching array or ta is not present in expertTa array of course
                matchingCourse.expertTa.push(profTaRollNumber.rollNumber);
                if(ta.upperCap>0){  // if ta has upper cap

                  ta.upperCap--; // decrementing the upper cap of ta
                }
                if(ta.upperCap===0){
                  taAssigned[ta.rollNumber]=true; // if upper cap of ta is 0 then assigning ta to professor
                }
              }
                
              
              noOfTaRequired--;
            }
            if(noOfTaRequired===0){  // if no of ta required is 0 then break
              break;
            }
          }
          if(noOfTaRequired===0){
            break;
          }
        }
      }

      if(batchTag){ // if professor preference contains batch tag

        const sepByBatch= tas.filter(ta => !taAssigned[ta.rollNumber] && ta.rollNumber.slice(0,3)===profTaRollNumber.rollNumber);  // filtering the ta with same batch tag as professor preference
        // console.log("sepByBatch",sepByBatch);

  
        const tempTA0=[];
        const tempTA1=[];
        const tempTA2=[];

        /// iterating over all the ta with same batch tag as professor preference and sorting them on cgpa and course grade

        for(var k=0;k<sepByBatch.length;k++){

          if(!taAssigned[sepByBatch[k].rollNumber]){
            if(sepByBatch[k].preferences[0].courseCode===professor.courseCode){
                if(checkCourseGrade(sepByBatch[k].preferences[0].courseGrade,professor.courseGrade)){
                    tempTA0.push({
                      rollNumber:sepByBatch[k].rollNumber,
                      cgpa:sepByBatch[k].cgpa,
                      courseGrade:sepByBatch[k].preferences[0].courseGrade,
                      weight:sepByBatch[k].preferences[0].weight,
                      upperCap:sepByBatch[k].upperCap,
                    });
                    }
                }
            

            if(sepByBatch[k].preferences[1].courseCode===professor.courseCode){
                if(checkCourseGrade(sepByBatch[k].preferences[1].courseGrade,professor.courseGrade)){
                    tempTA1.push({
                      rollNumber:sepByBatch[k].rollNumber,
                      cgpa:sepByBatch[k].cgpa,
                      courseGrade:sepByBatch[k].preferences[1].courseGrade,
                      weight:sepByBatch[k].preferences[1].weight,
                      upperCap:sepByBatch[k].upperCap,
                    });
                  }
                }
            

            if(sepByBatch[k].preferences[2].courseCode===professor.courseCode){
                if(checkCourseGrade(sepByBatch[k].preferences[2].courseGrade,professor.courseGrade)){
                    tempTA2.push({
                      rollNumber:sepByBatch[k].rollNumber,
                      cgpa:sepByBatch[k].cgpa,
                      courseGrade:sepByBatch[k].preferences[2].courseGrade,
                      weight:sepByBatch[k].preferences[2].weight,
                      upperCap:sepByBatch[k].upperCap,
                    });
                }
            }
          }
        }

        var temTA=[...tempTA0,...tempTA1,...tempTA2];
        // console.log("temTA",temTA);
        temTA.sort((a, b) => {b.cgpa - a.cgpa});

        // console.log("temTA soeted cgpa",temTA);
        
        sortOnGrade(temTA);
        /////////////////////////////////////////////////////////////////////////////////////////////

        ///

        for(var k=0;k<temTA.length;k++){
          x= findProfessorByTARollNumber(professors,temTA[k].rollNumber,professor.courseCode);
          if(noOfTaRequired>0){
            var checkweight1=true;
            if(x!== undefined && !taAssigned[ta.rollNumber]){
              x.forEach((pref)=>{
                pref.preferences.forEach((p)=>{
                  // console.log("p",p,"profTaRollNumber",profTaRollNumber,"weight",profTaRollNumber.weight);
                  if(p.rollNumber===temTA[k].rollNumber){
                    checkweight1=false;
                  }
                })
              })
            }
            // if (!x) {
              const matchingCourse = matching.find(
                (m) => m.courseCode === professor.courseCode
              ); // finding the course in matching array  
            
              if (matchingCourse &&(!matchingCourse.expertTa || !matchingCourse.expertTa.includes(temTA[k].rollNumber))  // if the course is not present in matching array or ta is not present in expertTa array of course
              )
              {
                matchingCourse.expertTa.push(temTA[k].rollNumber); // adding ta to expertTa array of course
            
                if (temTA[k].upperCap > 0) {
                  temTA[k].upperCap--;
                }
                if (temTA[k].upperCap === 0) {
                  taAssigned[temTA[k].rollNumber] = true;
                }
                noOfTaRequired--;
                break;
              }
            // }
          }
        }

        /////////////////////////////////////////////////////////////////////////////////////////////
      }
    }

    // if still no of ta required is greater than 0 then iterating over all the ta and sorting them on cgpa and course grade
    // and assigning them to professor if they are not assigned to any professor
    // and if no of ta required is 0 then break

    if (noOfTaRequired > 0) {
      const allTa_0 = tas.filter(ta => !taAssigned[ta.rollNumber] && professor.courseCode === ta.preferences[0].courseCode && checkCourseGrade(ta.preferences[0].courseGrade, professor.courseGrade));
      const allTa_1 = tas.filter(ta => !taAssigned[ta.rollNumber] && professor.courseCode === ta.preferences[1].courseCode && checkCourseGrade(ta.preferences[1].courseGrade, professor.courseGrade));
      const allTa_2 = tas.filter(ta => !taAssigned[ta.rollNumber] && professor.courseCode === ta.preferences[2].courseCode && checkCourseGrade(ta.preferences[2].courseGrade, professor.courseGrade));
      const allTa = [...allTa_0, ...allTa_1, ...allTa_2];
      allTa.sort((a, b) => b.cgpa - a.cgpa);
      // allTa.sort((a, b) => a.cgpa - b.cgpa);
      sortOnGrade(allTa);
    
      for (var k = 0; k < allTa.length; k++) {
        const matchingCourse = matching.find(m => m.courseCode === professor.courseCode);
        if (matchingCourse && (!matchingCourse.expertTa || !matchingCourse.expertTa.includes(allTa[k].rollNumber))) {
          matchingCourse.expertTa.push(allTa[k].rollNumber);
    
          if (allTa[k].upperCap > 0) {
            allTa[k].upperCap--;
          }
          if (allTa[k].upperCap === 0) {
            taAssigned[allTa[k].rollNumber] = true;
          }
    
          noOfTaRequired--;
          if (noOfTaRequired === 0) {
            break;
          }
        }
      }
    }    

    //////////////////////////////////////////////////////////////////////////////////
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
