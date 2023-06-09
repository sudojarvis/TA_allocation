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

  function courseChosenByTa(taRollNumber,tas,courseCode){
    const ta = tas.find(ta => ta.rollNumber === taRollNumber);
    if(ta){
      return ta.preferences.some(preference => preference.courseCode === courseCode);

    }
    return false;
  }

  function findProfessorByTARollNumber(professors, taRollNumber, excludedProfessor) {
    return professors.filter(professor => professor.courseCode !== excludedProfessor && courseChosenByTa(taRollNumber,tas,professor.courseCode));
  }
  


    const professors = prof.map(p => ({
      courseCode: p.courseCode,
      // preferences: [p.taRollNumber1, p.taRollNumber2, p.taRollNumber3],
      preferences: [{rollNumber:p.taRollNumber1,weight:3},{rollNumber:p.taRollNumber2,weight:2},{rollNumber:p.taRollNumber3,weight:1}],
    //   branch: p.branch,
      theoryLab: p.theoryLab,
      noOfStudents: p.nof,
      cgpa: p.cgpa,
      courseGrade: p.courseGrade,
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
    }));
    
    // console.log("professors",professors);
    // console.log("tas",tas);

  professors.forEach(professor => {
    const studentPerTA = professor.theoryLab === "theory" ? 30 : 15;

    var noOfTaRequired = Math.ceil(professor.noOfStudents / studentPerTA);
    // console.log("noOfTaRequired",noOfTaRequired);
    matching.push({ courseCode: professor.courseCode, expertTa: [] });

    const taWithSameCourse = tas.filter(ta =>
        ta.preferences.some(preference => preference.courseCode === professor.courseCode)
    );
    // taWithSameCourse.sort((a, b) => b.cgpa - a.cgpa);
    // console.log("taWithSameCourse",taWithSameCourse);



    const ta1 = taWithSameCourse.filter(ta => ta.preferences[0].courseCode === professor.courseCode);
    const ta2 = taWithSameCourse.filter(ta => ta.preferences[1].courseCode === professor.courseCode);
    const ta3 = taWithSameCourse.filter(ta => ta.preferences[2].courseCode === professor.courseCode);
    
    const ta1_=[];
    for(const ta of ta1){
        ta1_.push({
        rollNumber: ta.rollNumber,
        cgpa: ta.cgpa,
        courseGrade: ta.preferences[0].courseGrade,
        weight: ta.preferences[0].weight
    })
    }
    const ta2_=[];

    for(const ta of ta2){
        ta1_.push({
        rollNumber: ta.rollNumber,
        cgpa: ta.cgpa,
        courseGrade: ta.preferences[1].courseGrade,
        weight: ta.preferences[1].weight
    })
    }
    const ta3_=[];
    for (const ta of ta3) {
        ta1_.push({
        rollNumber: ta.rollNumber,
        cgpa: ta.cgpa,
        courseGrade: ta.preferences[2].courseGrade,
        weight: ta.preferences[2].weight
        });
    }
    const temp = [...ta1_, ...ta2_, ...ta3_];

    temp.sort((a, b) => b.cgpa - a.cgpa);
    // console.log("temp",temp);
    // let i = 0;
    // console.log("temp before",temp);

    sortOnGrade(temp);

    presentYear=new Date().getFullYear();
    lastTwoDigitOfYr=presentYear%100;
    const arrOfYear=[];
    for( var k =-4;k<=2;k++){
        arrOfYear.push(lastTwoDigitOfYr+k);
    }

    const tempArrBt=arrOfYear.map((num)=>'b'+num);
    const tempArrMt=arrOfYear.map((num)=>'m'+num);
    const tempArrPh=arrOfYear.map((num)=>'p'+num);

    const arrOfBatch=[...tempArrBt,...tempArrMt,...tempArrPh];


    for(const profTaRollNumber of professor.preferences){

  
      // console.log("arrOfBatch",arrOfBatch);

      // console.log('taRollNumber',taRollNumber.rollNumber);
      const batchTag= arrOfBatch.includes(profTaRollNumber.rollNumber);
      // console.log("batchTag",batchTag);
      // x= findProfessorByTARollNumber(professors,ta.rollNumber,professor.courseCode);
      if(!batchTag){
        for( const ta of temp){
          if(!taAssigned[ta.rollNumber]){

            x= findProfessorByTARollNumber(professors,ta.rollNumber,professor.courseCode);
            
            var chekWeight= true;

            if(x!==undefined&& !taAssigned[ta.rollNumber]){
              x.forEach((pref)=>{
                pref.preferences.forEach((p)=>{
                  console.log("p",p,"profTaRollNumber",profTaRollNumber,"weight",profTaRollNumber.weight);
                  if(p.rollNumber===ta.rollNumber && p.weight>profTaRollNumber.weight){
                    chekWeight=false;
                  }
                })
              })
            }
            // console.log("x",x);
            // console.log("chekWeight",chekWeight);
            // console.log("=======================================");
            
            if(ta.rollNumber === profTaRollNumber.rollNumber && noOfTaRequired>0 && (profTaRollNumber.weight>= ta.weight||ta.weight>=profTaRollNumber.weight) && chekWeight){
              // matching.push({ courseCode: professor.courseCode, expertTa: [] });
              // matching[professor.courseCode].expertTa.push([profTaRollNumber.rollNumber]);
              // matching[matching.length-1].expertTa.push(profTaRollNumber.rollNumber);
              matching.find(m => m.courseCode === professor.courseCode).expertTa.push(profTaRollNumber.rollNumber);
              taAssigned[ta.rollNumber]=true;
              // console.log("matching",matching.expertTa);
              // console.log("ta================================================",ta);
              
              noOfTaRequired--;
            }
            if(noOfTaRequired===0){
              break;
            }
          }
          if(noOfTaRequired===0){
            break;
          }
        }
      }

      if(batchTag){
        // console.log("batchTag",profTaRollNumber);


        // const sepByBatch1=[];

        // for(const ta of tas){
        //   if(!taAssigned[ta.rollNumber]){ //&& !professor.preferences.includes(ta.rollNumber)){
        //       tempBatch=ta.rollNumber.slice(0,3);
        //       console.log("tempBatch",tempBatch);
        //       if(profTaRollNumber.rollNumber===tempBatch){
        //           sepByBatch1.push(ta);
        //       }
        //   }
        //   // console.log("sepByBatch",sepByBatch);
        // }
        // console.log("sepByBatch1===",sepByBatch1);

        const sepByBatch= tas.filter(ta => !taAssigned[ta.rollNumber] && ta.rollNumber.slice(0,3)===profTaRollNumber.rollNumber);
        // console.log("sepByBatch",sepByBatch);

  
        const tempTA0=[];
        const tempTA1=[];
        const tempTA2=[];

        for(var k=0;k<sepByBatch.length;k++){

          if(!taAssigned[sepByBatch[k].rollNumber]){
            if(sepByBatch[k].preferences[0].courseCode===professor.courseCode){
                if(checkCourseGrade(sepByBatch[k].preferences[0].courseGrade,professor.courseGrade)){
                    tempTA0.push({
                      rollNumber:sepByBatch[k].rollNumber,
                      cgpa:sepByBatch[k].cgpa,
                      courseGrade:sepByBatch[k].preferences[0].courseGrade,
                      weight:sepByBatch[k].preferences[0].weight
                    });
                    }
                }
            

            if(sepByBatch[k].preferences[1].courseCode===professor.courseCode){
                if(checkCourseGrade(sepByBatch[k].preferences[1].courseGrade,professor.courseGrade)){
                    tempTA1.push({
                      rollNumber:sepByBatch[k].rollNumber,
                      cgpa:sepByBatch[k].cgpa,
                      courseGrade:sepByBatch[k].preferences[1].courseGrade,
                      weight:sepByBatch[k].preferences[1].weight
                    });
                  }
                }
            

            if(sepByBatch[k].preferences[2].courseCode===professor.courseCode){
                if(checkCourseGrade(sepByBatch[k].preferences[2].courseGrade,professor.courseGrade)){
                    tempTA2.push({
                      rollNumber:sepByBatch[k].rollNumber,
                      cgpa:sepByBatch[k].cgpa,
                      courseGrade:sepByBatch[k].preferences[2].courseGrade,
                      weight:sepByBatch[k].preferences[2].weight
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

        for(var k=0;k<temTA.length;k++){
          x= findProfessorByTARollNumber(professors,temTA[k].rollNumber,professor.courseCode);
          if(noOfTaRequired>0){
            var checkweight1=true;
            if(x!==undefined&& !taAssigned[ta.rollNumber]){
              x.forEach((pref)=>{
                pref.preferences.forEach((p)=>{
                  // console.log("p",p,"profTaRollNumber",profTaRollNumber,"weight",profTaRollNumber.weight);
                  if(p.rollNumber===temTA[k].rollNumber){
                    checkweight1=false;
                  }
                })
              })
            }
            if(!x){

              matching.find(m => m.courseCode === professor.courseCode).expertTa.push(temTA[k].rollNumber);
              taAssigned[temTA[k].rollNumber]=true;
              noOfTaRequired--;
              break;
            }
          }
        }
      }
    }


    if(noOfTaRequired>0){
      const allTa_0=tas.filter(ta => !taAssigned[ta.rollNumber] && professor.courseCode===ta.preferences[0].courseCode);
      const allTa_1=tas.filter(ta => !taAssigned[ta.rollNumber] && professor.courseCode===ta.preferences[1].courseCode);
      const allTa_2=tas.filter(ta => !taAssigned[ta.rollNumber] && professor.courseCode===ta.preferences[2].courseCode);
      const allTa=[...allTa_0,...allTa_1,...allTa_2];
      allTa.sort((a, b) => {b.cgpa - a.cgpa});
      sortOnGrade(allTa);
      for(var k=0;k<allTa.length;k++){
        matching.find(m => m.courseCode === professor.courseCode).expertTa.push(allTa[k].rollNumber);
        taAssigned[allTa[k].rollNumber]=true;
        noOfTaRequired--;
        if(noOfTaRequired===0){
          break;
        }

      }
    }
    

  });
  
  
  jsonformated=[]

  for(const m of matching){
      jsonformated.push({
          "courseCode":m.courseCode.toUpperCase().toString(),
          "expertTa":m.expertTa.toString().toUpperCase()
          // "traineeTa":m.traineeTa.toString().toUpperCase()
      });
  }


    return jsonformated;
    // return matching;
};





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


//   result=allotment(prof,ta);
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
