const { json } = require("body-parser");

const XLSX = require("xlsx");

function allotment(prof, ta) {
    const matching = [];
    // const professorAssigned = {};
    const taAssigned = {};
  
    // Helper function to compare TAs based on CGPA and course grade
   function checkCourseGrade(a, b) {
    const courseGrade = ['f','e-','e','d-','d','c-','c','b-','b','a-','a'];
    if (courseGrade.indexOf(a) >= courseGrade.indexOf(b)) {
        return 1;
    } else {
        return 0;
    }
   }

    // Initialize professor and TA arrays
    const professors = prof.map(p => ({
      courseCode: p.courseCode,
      taRollNumbers: [p.taRollNumber1, p.taRollNumber2, p.taRollNumber3],
    //   branch: p.branch,
      theoryLab: p.theoryLab,
      noOfStudents: p.nof,
    //   cgpa: p.cgpa,
      courseGrade: p.courseGrade

    }));
    // console.log("professors",professors);

    // console.log("professors",professors);

    const tas = ta.map(t => ({
      rollNumber: t.rollNumber,
      preferences: [
        {courseCode: t.pref1, courseGrade: t.course_grade_pref_1},
        {courseCode: t.pref2, courseGrade: t.course_grade_pref_2},
        {courseCode: t.pref3, courseGrade: t.course_grade_pref_3}
      ],
    //   branch: t.branch,
    //   cgpa: t.cgpa,
    //   courseGrade: t.courseGrade
    }));
    
    // console.log("professors",professors);
    // console.log("tas",tas);

    professors.forEach(professor => {
    //   const unassignedProfessor = { ...professor };
        studentPerTA = professor.theoryLab =="theory" ? 30 : 15;
        noOfTaRequired = Math.ceil(professor.noOfStudents/studentPerTA);
        console.log("noOfTaRequired",noOfTaRequired);

        //   console.log("noOfTaRequired",noOfTaRequired);
        //   let assignedTA = null;
        matching.push({ courseCode: professor.courseCode, expertTa: [] });

      // Check if any TA from the professor's preference list is available
        for (const taRollNumber of professor.taRollNumbers) {
            const taIndex = tas.findIndex(ta => ta.rollNumber === taRollNumber && (ta.preferences[0].courseCode === professor.courseCode || ta.preferences[1].courseCode === professor.courseCode || ta.preferences[2].courseCode === professor.courseCode));
     
              

            console.log("taRollNumber, ",taRollNumber,"taIndex ",taIndex);
            // console.log("taIndex",taIndex);
            
            if (taIndex !== -1 && !taAssigned[taRollNumber]) {
            const ta = tas[taIndex];
            //   console.log("ta",ta);
            // console.log(ta.rollNumber.splice(0,2));

                if(noOfTaRequired>0){
                    matching.find(m => m.courseCode === professor.courseCode).expertTa.push(ta.rollNumber);
                    // matching.find(taRollNumber => taRollNumber.courseCode === professor.courseCode).expertTa.push(ta.rollNumber);
            
                    // console.log("matching",matching);
                    taAssigned[ta.rollNumber] = true;
                    noOfTaRequired--;
                }
                if(noOfTaRequired==0){
                    break;
                    }
            }

            if(taIndex ==-1){
                presentYear=new Date().getFullYear();
                lastTwoDigitOfYr=presentYear%100;
                const arrOfYear=[]
                for( var i =-4;i<=2;i++){
                    arrOfYear.push(lastTwoDigitOfYr+i);
                }

                const tempArrBt=arrOfYear.map((num)=>'b'+num);
                const tempArrMt=arrOfYear.map((num)=>'m'+num);
                const tempArrPh=arrOfYear.map((num)=>'p'+num);

                const arrOfBatch=[...tempArrBt,...tempArrMt,...tempArrPh];

                // console.log("arrOfBranch",arrOfBatch);
                // console.log("ifExistBatch",taRollNumber);
                const ifExistBatch = arrOfBatch.findIndex((batch)=>batch==taRollNumber);
                // console.log("ifExistBatch",ifExistBatch);

                if(ifExistBatch!=-1){
                    sepByBatch=[];
                    for(const ta of tas){
                        if(!taAssigned[ta.rollNumber] && !professor.taRollNumbers.includes(ta.rollNumber)){
                            tempBatch=ta.rollNumber.slice(0,3);
                            // console.log("tempBatch",tempBatch);
                            if(taRollNumber==tempBatch){
                                // console.log("t",ta);
                                sepByBatch.push(ta);
                            }
                        }
                    }
                    // console.log("sepByBatch",sepByBatch);

                    tempTA0=sepByBatch.filter((t) => {
                        if(!taAssigned[t.rollNumber] && t.preferences[0].courseCode==professor.courseCode){
                            if(checkCourseGrade(t.preferences[0].courseGrade,professor.courseGrade)){
                                return t;
                    
                            }
                        }
                    }
                    );
                    tempTA1=sepByBatch.filter((t) => {

                        if(!taAssigned[t.rollNumber] && t.preferences[1].courseCode==professor.courseCode){
                            if(checkCourseGrade(t.preferences[1].courseGrade,professor.courseGrade)){
                                return t;
                            }
                        }
                    }
                    );
                    tempTA2=sepByBatch.filter((t) => {
                        if(!taAssigned[t.rollNumber] && t.preferences[2].courseCode==professor.courseCode){
                            if(checkCourseGrade(t.preferences[2].courseGrade,professor.courseGrade)){
                                return t;
                            }
                        }
                    }
                    );
                    // console.log("tempTA0",tempTA0);
                    // console.log("tempTA1",tempTA1);
                    // console.log("tempTA2",tempTA2);

                    temTa=[];

                    for(const t of tempTA0){
                        temTa.push({
                            rollNumber:t.rollNumber,
                            pref: t.preferences[0].courseCode,
                            courseGrade: t.preferences[0].courseGrade
                        });
                        }

                    for(const t of tempTA1){
                        temTa.push({
                            rollNumber:t.rollNumber,
                            pref: t.preferences[1].courseCode,
                            courseGrade: t.preferences[1].courseGrade
                        });
                        }

                    for(const t of tempTA2){
                        temTa.push({
                            rollNumber:t.rollNumber,
                            pref: t.preferences[2].courseCode,
                            courseGrade: t.preferences[2].courseGrade
                        });

                    }

                
                    console.log("temTa",temTa);
                    for(const t of temTa){
                        if(noOfTaRequired>0 && !professor.taRollNumbers.includes(t.rollNumber)){
                            matching.find(m=>m.courseCode==professor.courseCode).expertTa.push(t.rollNumber);
                            console.log("tempTa",t.rollNumber);
                            taAssigned[t.rollNumber]=true;
                            noOfTaRequired--;
                            break;
                        }
                    }
                }

            }

        }
    // console.log("nofTa",noOfTaRequired);
    
    // console.log("matching",matching);
 
    // professors.forEach((professor) => {

        if(noOfTaRequired>0){

            tempTA0=tas.filter((t) => {
                if(!taAssigned[t.rollNumber] && t.preferences[0].courseCode==professor.courseCode){
                    if(checkCourseGrade(t.preferences[0].courseGrade,professor.courseGrade)){
                        return t;
            
                    }
                }
            });
            tempTA1=tas.filter((t) => {
                if(!taAssigned[t.rollNumber] && t.preferences[1].courseCode==professor.courseCode){
                    if(checkCourseGrade(t.preferences[1].courseGrade,professor.courseGrade)){
                        return t;
                    }
                }
            });
            tempTA2=tas.filter((t) => {
                if(!taAssigned[t.rollNumber] && t.preferences[2].courseCode==professor.courseCode){
                    if(checkCourseGrade(t.preferences[2].courseGrade,professor.courseGrade)){
                        return t;
                    }
                }
            });

            eligibleTa=[];

            for(const t of tempTA0){
                eligibleTa.push({
                    rollNumber:t.rollNumber,
                    pref:t.preferences[0].courseCode,
                    // cgpa:t.cgpa,
                    courseGrade:t.preferences[0].courseGrade
                });
            }

            for(const t of tempTA1){
                eligibleTa.push({
                    rollNumber:t.rollNumber,
                    pref:t.preferences[1].courseCode,
                    // cgpa:t.cgpa,
                    courseGrade:t.preferences[1].courseGrade
                });
            }

            for(const t of tempTA2){
                eligibleTa.push({
                    rollNumber:t.rollNumber,
                    pref:t.preferences[2].courseCode,
                    // cgpa:t.cgpa,
                    courseGrade:t.preferences[2].courseGrade
                });
            }

            console.log("eligibleTa",eligibleTa);

        //     // assignig the ta to the professor

            for(const t of eligibleTa){
                if(noOfTaRequired>0){
                    matching.find(m => m.courseCode === professor.courseCode).expertTa.push(t.rollNumber);
                    taAssigned[t.rollNumber] = true;
                    noOfTaRequired--;
                }
                if(noOfTaRequired==0){
                    break;
                }
            }
        }    
    // }
    console.log("-------------------------------------------------")
      
    });

    jsonfrmated=[]

    for(const m of matching){
        jsonfrmated.push({
            "courseCode":m.courseCode.toUpperCase().toString(),
            "expertTa":m.expertTa.toString().toUpperCase()
            // "traineeTa":m.traineeTa.toString().toUpperCase()
        });
    }

    console.log("jsonfrmated",jsonfrmated);

    // jsonMatching = JSON.stringify(jsonfrmated);
    // jsonMatching = JSON.stringify(x);

    return jsonfrmated;
    // return matching;
}


module.exports = allotment;



//   const prof = [
//     {
//     //   _id: new ObjectId("647b4dab37c4ac2be44b90b9"),
//       courseCode: 'eel1010',
//       ugPg: 'ug',
//       electiveCore: 'core',
//       needToAttend: 0,
//       nof: 123,
//       theoryLab: 'theory',
//       cgpa: 8,
//       courseGrade: 'a-',
//       taRollNumber1: 'b20',
//       taRollNumber2: 'b20cs0111',
//       taRollNumber3: 'b20ee0124',
//       __v: 0
//     },
//     {
//     //   _id: new ObjectId("647b4f755e59c516bc8bec82"),
//       courseCode: 'csl1010',
//       ugPg: 'ug',
//       electiveCore: 'core',
//       needToAttend: 0,
//       nof: 123,
//       theoryLab: 'theory',
//       cgpa: 8,
//       courseGrade: 'a',
//       taRollNumber1: 'b20ee011',
//       taRollNumber2: 'b20cs010',
//       taRollNumber3: 'b30cs000',
//       __v: 0
//     }
//   ];
  

//   const ta = [
//     {
//     //   _id: new ObjectId("647b4cfe37c4ac2be44b90b6"),
//       rollNumber: 'm21ee011',
//       cgpa: 9,
//       pref1: 'eel1010',
//       course_grade_pref_1: 'a-',
//       pref2: 'eel1020',
//       course_grade_pref_2: 'a',
//       pref3: 'eel1030',
//       course_grade_pref_3: 'a-',
//       __v: 0
//     },
//     {
//     //   _id: new ObjectId("647b4fc05e59c516bc8bec85"),
//         rollNumber: 'b20ee0124',
//         cgpa: 9,
//         pref1: 'eel1030',
//         course_grade_pref_1: 'a',
//         pref2: 'eel1020',
//         course_grade_pref_2: 'a',
//         pref3: 'eel1010',
//         course_grade_pref_3: 'a-',
//         __v: 0
//     },
//     {
//     //   _id: new ObjectId("647b4fc05e59c516bc8bec85"),
        
//         rollNumber: 'b20ee0125',
//         cgpa: 9,
//         pref1: 'eel1010',
//         course_grade_pref_1: 'a',
//         pref2: 'eel1020',
//         course_grade_pref_2: 'a',
//         pref3: 'eel1030',
//         course_grade_pref_3: 'a-',
//         __v: 0
//     },
//     {
//     //   _id: new ObjectId("647b4fc05e59c516bc8bec85"),
//     rollNumber: 'b20ee0126',
//     cgpa: 9,
//     pref1: 'eel1010',
//     course_grade_pref_1: 'a',
//     pref2: 'eel1020',
//     course_grade_pref_2: 'a',
//     pref3: 'eel1030',
//     course_grade_pref_3: 'a-',
//     __v: 0
//     },
//     {
//     //   _id: new ObjectId("647b4fc05e59c516bc8bec85"),
//     rollNumber: 'b20ee0127',
//     cgpa: 9,
//     pref1: 'csl1010',
//     course_grade_pref_1: 'a',
//     pref2: 'eel1020',
//     course_grade_pref_2: 'a',
//     pref3: 'eel1030',
//     course_grade_pref_3: 'a-',
//     __v: 0 
//     },
//     {
//     //   _id: new ObjectId("647b4fc05e59c516bc8bec85"),
//     rollNumber: 'b20cs0111',
//     cgpa: 9,
//     pref1: 'eel1010',
//     course_grade_pref_1: 'a',
//     pref2: 'csl1010',
//     course_grade_pref_2: 'a',
//     pref3: 'eel1030',
//     course_grade_pref_3: 'a-',
//     __v: 0
//     },


//   ];


//   console.log(result);

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
