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
      // cgpa: p.cgpa,
      courseGrade: p.courseGrade,
      instructor: p.instructorName,
      courseName: p.courseName,
      prefFilled: count
    };
  });

  // console.log(professors);
  

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

  console.log(tas);    
 

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
          
          
          if(!taAssigned[ta.rollNumber] && !specificallyChosenByOtherProf(ta.rollNumber,professor.courseCode)){

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
    // console.log("-------------------------------");
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

  // console.log("jsonformated",jsonformated);

    return jsonformated;
    // return matching;
};





module.exports = allotment;



// const profs = [{
//   "_id": {
//     "$oid": "64bcdc4ca9e301deb420b165"
//   },
//   "courseCode": "eel1010",
//   "courseName": "dasds",
//   "instructorName": "sdffd",
//   "ugPg": "ug",
//   "electiveCore": "elective",
//   "needToAttend": 0,
//   "nof": 234,
//   "theoryLab": "theory",
//   "courseGrade": "a",
//   "taRollNumber1": "p20ee002",
//   "taRollNumber2": "p20ee001",
//   "taRollNumber3": "p20ee005",
//   "password": "$2a$08$PA1LkPuo84xXj1fohpoDlufhftqv7rqsFaYToWKNzz.Q3INhp5PFm",
//   "__v": 0
// },
// {
//   "_id": {
//     "$oid": "64bcdc99a9e301deb420b168"
//   },
//   "courseCode": "eel2020",
//   "courseName": "sdads",
//   "instructorName": "vcnxb",
//   "ugPg": "ug",
//   "electiveCore": "core",
//   "needToAttend": 0,
//   "nof": 38,
//   "theoryLab": "theory",
//   "courseGrade": "a",
//   "taRollNumber1": "p20ee001",
//   "taRollNumber2": "p20ee002",
//   "taRollNumber3": "p20ee003",
//   "password": "$2a$08$DBDYWxeSNufFuJmNva9Cpesm4swYTN9SjqgZ944iIdh631IJ2soMa",
//   "__v": 0
// },
// {
//   "_id": {
//     "$oid": "64bcdcdda9e301deb420b16b"
//   },
//   "courseCode": "eel3030",
//   "courseName": "sdfs",
//   "instructorName": "nht",
//   "ugPg": "ug",
//   "electiveCore": "elective",
//   "needToAttend": 1,
//   "nof": 232,
//   "theoryLab": "theory",
//   "courseGrade": "a-",
//   "taRollNumber1": "p20ee003",
//   "taRollNumber2": "p20ee004",
//   "taRollNumber3": "p20ee001",
//   "password": "$2a$08$gqmKjqmefLXzxGFg4vIv1.dE8RY.J75IHUAP7M00MPKep.OIJFjI.",
//   "__v": 0
// }]



// const tas = [{
//   "_id": {
//     "$oid": "64bcdaa4a9e301deb420b15c"
//   },
//   "rollNumber": "p20ee011",
//   "cgpa": 9,
//   "pref1": "eel1010",
//   "course_grade_pref_1": "a-",
//   "pref2": "eel2020",
//   "course_grade_pref_2": "a-",
//   "pref3": "eel3030",
//   "course_grade_pref_3": "b-",
//   "password": "$2a$08$qZBba4s788O39DAQpE7sdeAld.ZMBUbxHXA2xtW9XsLx8YkSrdSxC",
//   "__v": 0
// },
// {
//   "_id": {
//     "$oid": "64bcdb77a9e301deb420b15f"
//   },
//   "rollNumber": "p20ee002",
//   "cgpa": 9,
//   "pref1": "eel2020",
//   "course_grade_pref_1": "a",
//   "pref2": "eel1010",
//   "course_grade_pref_2": "a-",
//   "pref3": "eel3030",
//   "course_grade_pref_3": "a-",
//   "password": "$2a$08$O/DWxT3wAtxjpaFeTldjSeWqBpKHP670RuqLSH7U8L.GwePAgOOtq",
//   "__v": 0
// },
// {
//   "_id": {
//     "$oid": "64bcdbdba9e301deb420b162"
//   },
//   "rollNumber": "p20ee003",
//   "cgpa": 9,
//   "pref1": "eel3030",
//   "course_grade_pref_1": "a-",
//   "pref2": "eel1010",
//   "course_grade_pref_2": "a-",
//   "pref3": "eel1010",
//   "course_grade_pref_3": "a-",
//   "password": "$2a$08$VPqONRHPrsYRTiVe/pZ9tuOvnb7Ob1vGw6mREKmsAxlk3g7Nd2GRO",
//   "__v": 0
// }]

// console.log(allotment(profs, tas));


