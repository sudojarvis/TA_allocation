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
            const courseGradeOrder = ['f', 'e-', 'e', 'd-', 'd', 'c-', 'c', 'b-', 'b', 'a-', 'a', 'a*'];
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

    let nofTarequired = 0;

    if (p.theoryLab === "theory") {
      nofTarequired = Math.ceil(p.nof / 30);
    } else {
      nofTarequired = Math.ceil(p.nof / 15);
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

  // console.log(tas);    
 

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
            else if(taAssigned[taPref[i].rollNumber]){
              // var taCourseIndex = matching.findIndex(m => m.courseCode === professor.courseCode);
              
              var prevtaCourseIndex = matching.findIndex(m => m.expertTa.includes(taPref[i].rollNumber));

              var prevCourseCode = matching[prevtaCourseIndex].courseCode;
              

              var currentTaWeight = taPref[i].preferences.find(pref => pref.courseCode === professor.courseCode).weight;
              var prevtaWeight = taPref[i].preferences.find(pref => pref.courseCode === prevCourseCode).weight;
              
              if(currentTaWeight>prevtaWeight){
                matching[prevtaCourseIndex].expertTa.splice(matching[prevtaCourseIndex].expertTa.indexOf(taPref[i].rollNumber),1);
                matching.find(m => m.courseCode === professor.courseCode).expertTa.push(taPref[i].rollNumber);
                noOftasRequired--;
                taAssigned[taPref[i].rollNumber]=true;
                break;
              }
          
            }
          }

        }
        else if (ugBatchTag.includes(profTaRollNumber)){
          // console.log(ugBatchTag.includes(profTaRollNumber));
          var tempTa = ugTas.filter(ta => ta.rollNumber.slice(0, 3) === profTaRollNumber && !specificallyChosenByOtherProf(ta.rollNumber, professor.courseCode) && taAssignedBatchTag[ta.rollNumber]!==true);
          // console.log("tempTa", tempTa);

          // console.log("tempTa", tempTa);
          var taPref1 = tempTa.filter(ta => ta.preferences[0].courseCode === professor.courseCode && matching.find(m => m.courseCode === professor.courseCode).expertTa.indexOf(ta.rollNumber) === -1 && checkCourseGrade(ta.preferences[0].courseGrade, professor.courseGrade) && ta.cgpa!==null);
          // console.log("taPref1", taPref1);
          var taPref2 = tempTa.filter(ta => ta.preferences[1].courseCode === professor.courseCode && matching.find(m => m.courseCode === professor.courseCode).expertTa.indexOf(ta.rollNumber) === -1 && checkCourseGrade(ta.preferences[1].courseGrade, professor.courseGrade) && ta.cgpa!==null);
          // console.log("taPref2", taPref2);
          var taPref3 = tempTa.filter(ta => ta.preferences[2].courseCode === professor.courseCode && matching.find(m => m.courseCode === professor.courseCode).expertTa.indexOf(ta.rollNumber) === -1 && checkCourseGrade(ta.preferences[2].courseGrade, professor.courseGrade) && ta.cgpa!==null);
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

    if (noOftasRequired > 0){ //&& professor.prefFilled===0) {
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
          else{
            
            if(!specificallyChosenByOtherProf(ta.rollNumber,professor.courseCode)){
              var prevtaCourseIndex = matching.findIndex(m => m.expertTa.includes(ta.rollNumber));
              var prevCourseCode = matching[prevtaCourseIndex].courseCode;
              var currentTaWeight = ta.preferences.find(pref => pref.courseCode === professor.courseCode).weight;
              var prevtaWeight = ta.preferences.find(pref => pref.courseCode === prevCourseCode).weight;
              
              if(currentTaWeight>prevtaWeight){
                matching[prevtaCourseIndex].expertTa.splice(matching[prevtaCourseIndex].expertTa.indexOf(ta.rollNumber),1);
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
    }
          // if all pg students are over then assign ug students to the course
    if (noOftasRequired > 0) { // && professor.prefFilled===0) {
      var temp1 = ugTas.filter(ta => ta.preferences[0].courseCode === professor.courseCode && checkCourseGrade(ta.preferences[0].courseGrade, professor.courseGrade) && ta.cgpa!==null);
      var temp2 = ugTas.filter(ta => ta.preferences[1].courseCode === professor.courseCode && checkCourseGrade(ta.preferences[1].courseGrade, professor.courseGrade) && ta.cgpa!==null);
      var temp3 = ugTas.filter(ta => ta.preferences[2].courseCode === professor.courseCode && checkCourseGrade(ta.preferences[2].courseGrade, professor.courseGrade) && ta.cgpa!==null);

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



const profs = [{
  "_id": {
    "$oid": "64bece1d9e6ddbd2c6382635"
  },
  "courseCode": "eel2030",
  "courseName": "circuit theory",
  "instructorName": "sandeep kumar yadav",
  "ugPg": "ug",
  "electiveCore": "elective",
  "needToAttend": 1,
  "nof": 84,
  "theoryLab": "theory",
  "courseGrade": "a-",
  "taRollNumber1": "p19ee207",
  "taRollNumber2": "",
  "taRollNumber3": "",
  "password": "$2a$08$Gla9gPELSz6Pjxi6Cu4jmew6GyV2lSJi3qpBPMqdGJfNfhIc9ptBu",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bed1569e6ddbd2c6382660"
  },
  "courseCode": "shl7430",
  "courseName": "mems technology for biomedical applications",
  "instructorName": "kamaljit rangra",
  "ugPg": "ug",
  "electiveCore": "core",
  "needToAttend": 0,
  "nof": 7,
  "theoryLab": "theory",
  "courseGrade": "a-",
  "taRollNumber1": "",
  "taRollNumber2": "",
  "taRollNumber3": "",
  "password": "$2a$08$qSLehy2/o07hnbor34MHM.PbxYUJIA7.1wHbJbt/1xzFRfpbf5HY2",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bed2cb9e6ddbd2c638266c"
  },
  "courseCode": "eel3080",
  "courseName": "data communication networks",
  "instructorName": "arun kumar singh",
  "ugPg": "pg",
  "electiveCore": "core",
  "needToAttend": 0,
  "nof": 87,
  "theoryLab": "theory",
  "courseGrade": "a-",
  "taRollNumber1": "p19ee201",
  "taRollNumber2": "p19ee015",
  "taRollNumber3": "",
  "password": "$2a$08$ocGr2hS2Wk7UU7hcBB/1JuOaEWhNgIMAZlZDdSGwOwE1Uf0P/JCYW",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bed7b7213676164c71a916"
  },
  "courseCode": "eel2010",
  "courseName": "signals and systems",
  "instructorName": "rajendra nagar",
  "ugPg": "ug",
  "electiveCore": "core",
  "needToAttend": 0,
  "nof": 187,
  "theoryLab": "theory",
  "courseGrade": "a-",
  "taRollNumber1": "p19ee013",
  "taRollNumber2": "m22ee107",
  "taRollNumber3": "",
  "password": "$2a$08$N57oQ/79EPfsAYQIGBMJg.c9gtCx1ml3Dn.GZ79.3jn0t5R50dKt2",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bed864213676164c71a91d"
  },
  "courseCode": "eel2020",
  "courseName": "digital design",
  "instructorName": "nitin bhatia",
  "ugPg": "ug",
  "electiveCore": "core",
  "needToAttend": 0,
  "nof": 178,
  "theoryLab": "theory",
  "courseGrade": "a-",
  "taRollNumber1": "p19",
  "taRollNumber2": "p20",
  "taRollNumber3": "p18",
  "password": "$2a$08$k0ySEnB/x4OMIGSiYZg8MONNkbBk/Pg6NrSov0IJNMOVkEXUH6/6K",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bedde6213676164c71a957"
  },
  "courseCode": "eel2050",
  "courseName": "physical electronics",
  "instructorName": "harshit agarwal",
  "ugPg": "ug",
  "electiveCore": "core",
  "needToAttend": 0,
  "nof": 82,
  "theoryLab": "theory",
  "courseGrade": "a-",
  "taRollNumber1": "p20",
  "taRollNumber2": "p22",
  "taRollNumber3": "",
  "password": "$2a$08$s2rYPQ2nf7i.P61blr/eA.jYi8jI1tsoZWPA4hHytApHEhJxVXjwG",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bf51e811a87dba93a329a0"
  },
  "courseCode": "eel2040",
  "courseName": "engineering electromagnetics",
  "instructorName": "soumava mukherjee",
  "ugPg": "ug",
  "electiveCore": "elective",
  "needToAttend": 0,
  "nof": 120,
  "theoryLab": "theory",
  "courseGrade": "a",
  "taRollNumber1": "p20",
  "taRollNumber2": "p20",
  "taRollNumber3": "p20",
  "password": "$2a$08$oqn/NA4nlgWn4VFe8RA6weUctOwN1bRaAo8oPPCxs36YZK8/PKO0m",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bf52da11a87dba93a329a5"
  },
  "courseCode": "eel3090",
  "courseName": "embedded systems",
  "instructorName": "binod kumar",
  "ugPg": "ug",
  "electiveCore": "core",
  "needToAttend": 0,
  "nof": 177,
  "theoryLab": "theory",
  "courseGrade": "a-",
  "taRollNumber1": "p20",
  "taRollNumber2": "p20",
  "taRollNumber3": "p20",
  "password": "$2a$08$Z7t0nZ/crCD2nA6UyIsEt.PMUfy8czry96Q8ZTjTRfyBHekDJejfW",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bf575911a87dba93a329c0"
  },
  "courseCode": "eel4040",
  "courseName": "data engineering",
  "instructorName": "xyz",
  "ugPg": "ug",
  "electiveCore": "core",
  "needToAttend": 0,
  "nof": 145,
  "theoryLab": "lab",
  "courseGrade": "a-",
  "taRollNumber1": "p20",
  "taRollNumber2": "p20",
  "taRollNumber3": "p20",
  "password": "$2a$08$jZUNdzkCCEslUMI2bT9HMu73car6HBG7cgsgcADw/OFEcVf3MBvyG",
  "__v": 0
}]


const tas = [{
  "_id": {
    "$oid": "64bece969e6ddbd2c6382638"
  },
  "rollNumber": "p19ee207",
  "cgpa": null,
  "pref1": "eel2030",
  "course_grade_pref_1": "",
  "pref2": "phl2040",
  "course_grade_pref_2": "",
  "pref3": "eel2010",
  "course_grade_pref_3": "",
  "password": "$2a$08$NgC5Mv2zwq1K1FuRsuopW.XF4CTvAin2yWiZH9tiZoHFfQiN3bBjS",
  "__v": 0
},
{
  "_id": {
    "$oid": "64beceec9e6ddbd2c638263d"
  },
  "rollNumber": "p19ee013",
  "cgpa": null,
  "pref1": "eel2010",
  "course_grade_pref_1": "",
  "pref2": "eel2020",
  "course_grade_pref_2": "",
  "pref3": "eel2030",
  "course_grade_pref_3": "",
  "password": "$2a$08$7W9.sjWHWA8HhOLb/AfuWOqhvKslJ02WKOfK3JPCKuwr5HHVB2UsS",
  "__v": 0
},
{
  "_id": {
    "$oid": "64becf6a9e6ddbd2c6382640"
  },
  "rollNumber": "m22ee107",
  "cgpa": null,
  "pref1": "eel2010",
  "course_grade_pref_1": "",
  "pref2": "eel3060",
  "course_grade_pref_2": "",
  "pref3": "shl7430",
  "course_grade_pref_3": "",
  "password": "$2a$08$W2wppwlNTrrBo6Y9ll2CYu/d59qmSULFLadKIYKjObgxrwuu44mXe",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bed0139e6ddbd2c6382643"
  },
  "rollNumber": "m22ee064",
  "cgpa": null,
  "pref1": "eel2010",
  "course_grade_pref_1": "",
  "pref2": "phl4050",
  "course_grade_pref_2": "",
  "pref3": "rml6020",
  "course_grade_pref_3": "",
  "password": "$2a$08$VZOWX9yUKSkRwzdqQZ.gmOJc0mL/C/pAeQqu9Kl.2OqDA6eIJvXiK",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bed04a9e6ddbd2c6382646"
  },
  "rollNumber": "p20ee203",
  "cgpa": null,
  "pref1": "eel2010",
  "course_grade_pref_1": "",
  "pref2": "eep2040",
  "course_grade_pref_2": "",
  "pref3": "eek5020",
  "course_grade_pref_3": "",
  "password": "$2a$08$Rr7AYIFx5uo2EYnqgZrzcOexZ7syaCLFZrty0QmLSmExbX/xOFPMO",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bed0d29e6ddbd2c6382651"
  },
  "rollNumber": "p19ee012",
  "cgpa": null,
  "pref1": "eel2030",
  "course_grade_pref_1": "",
  "pref2": "eel7130",
  "course_grade_pref_2": "",
  "pref3": "rml6020",
  "course_grade_pref_3": "",
  "password": "$2a$08$9tipy42T62d6Rvrn7z7tmORq/er/.BYO8wUR3Qs7E8Zf8GHZDVmxu",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bed1909e6ddbd2c6382663"
  },
  "rollNumber": "p19ee010",
  "cgpa": null,
  "pref1": "shl7430",
  "course_grade_pref_1": "",
  "pref2": "csl7650",
  "course_grade_pref_2": "",
  "pref3": "eel7500",
  "course_grade_pref_3": "",
  "password": "$2a$08$o0Qo/EUbmK/GQfp18AwDKu0Jv4j8IiC2pHQLIONs/zA/0D8Rw8nfu",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bed3049e6ddbd2c638266f"
  },
  "rollNumber": "p19ee015",
  "cgpa": null,
  "pref1": "eel3080",
  "course_grade_pref_1": "",
  "pref2": "eel2010",
  "course_grade_pref_2": "",
  "pref3": "eel3070",
  "course_grade_pref_3": "",
  "password": "$2a$08$FhkWNosOfGvdFMTihnUCZeRoFuSX8PTiXrG.VEzhUCNJphoATSs66",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bed3cb9e6ddbd2c6382674"
  },
  "rollNumber": "p19ee003",
  "cgpa": null,
  "pref1": "eel3080",
  "course_grade_pref_1": "",
  "pref2": "phl2040",
  "course_grade_pref_2": "",
  "pref3": "ppl4050",
  "course_grade_pref_3": "",
  "password": "$2a$08$9.jsBjzWHrjvbDihsjuzi.Ri5bwR7Fjp1mPV8NrhCFv2AiKAmSsQ2",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bed4899e6ddbd2c638267b"
  },
  "rollNumber": "p19ee201",
  "cgpa": null,
  "pref1": "eel3080",
  "course_grade_pref_1": "",
  "pref2": "eel2060",
  "course_grade_pref_2": "",
  "pref3": "phl2010",
  "course_grade_pref_3": "",
  "password": "$2a$08$Ih4ertRRyMYiv5fxkUHpuutGJFDxcFfxAvHNtH16vmzi8Ka3i4o9u",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bed5b19e6ddbd2c6382683"
  },
  "rollNumber": "p18ee203",
  "cgpa": null,
  "pref1": "eel2020",
  "course_grade_pref_1": "",
  "pref2": "eel7220",
  "course_grade_pref_2": "",
  "pref3": "php2010",
  "course_grade_pref_3": "",
  "password": "$2a$08$Yf2ilNLZTgUFoYFW91j4KOLhlBgKzx7QruOLeDR86pct.IgdZ2oeC",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bed727213676164c71a90f"
  },
  "rollNumber": "p20ee205",
  "cgpa": null,
  "pref1": "eel2010",
  "course_grade_pref_1": "",
  "pref2": "eel7220",
  "course_grade_pref_2": "",
  "pref3": "phl2010",
  "course_grade_pref_3": "",
  "password": "$2a$08$WwPRfzTNlDc3N2Akgzx29OcpUZB9eeWoobR0DIWE3p6OzfCPPIoHO",
  "__v": 0
},
{
  "_id": {
    "$oid": "64beda30213676164c71a934"
  },
  "rollNumber": "p20ee014",
  "cgpa": null,
  "pref1": "eel2020",
  "course_grade_pref_1": "",
  "pref2": "eel7220",
  "course_grade_pref_2": "",
  "pref3": "phl2010",
  "course_grade_pref_3": "",
  "password": "$2a$08$tMSYnLEKeK1g19yUvyzocuP7fDdkwLTC8qIF4foCVUc4.Ot7mrBOW",
  "__v": 0
},
{
  "_id": {
    "$oid": "64beda82213676164c71a93d"
  },
  "rollNumber": "p19ee205",
  "cgpa": null,
  "pref1": "eel2020",
  "course_grade_pref_1": "",
  "pref2": "eel7220",
  "course_grade_pref_2": "",
  "pref3": "php2010",
  "course_grade_pref_3": "",
  "password": "$2a$08$QYAe5CIj8OskRw7cQ7qtSO1RvXw5Ia5oyo.1yrKFWtLxwkmkfE6Ny",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bedc9f213676164c71a945"
  },
  "rollNumber": "p19ee006",
  "cgpa": null,
  "pref1": "eel2040",
  "course_grade_pref_1": "",
  "pref2": "eel7220",
  "course_grade_pref_2": "",
  "pref3": "php2010",
  "course_grade_pref_3": "",
  "password": "$2a$08$WjM/cvojGmG/YaN7DDJLrO6u9l1sha6g/z.zuiTQSg.Qf5bi09XZW",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bedd08213676164c71a94a"
  },
  "rollNumber": "m22ee105",
  "cgpa": null,
  "pref1": "eel2040",
  "course_grade_pref_1": "",
  "pref2": "eel2020",
  "course_grade_pref_2": "",
  "pref3": "php2010",
  "course_grade_pref_3": "",
  "password": "$2a$08$OunWobDnETk1IBySCdU0vOuNYwdpFLozwfAHvu2ALUFsDBosmflKe",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bede48213676164c71a95a"
  },
  "rollNumber": "p20ee018",
  "cgpa": null,
  "pref1": "eel2050",
  "course_grade_pref_1": "",
  "pref2": "eel3060",
  "course_grade_pref_2": "",
  "pref3": "eel7150",
  "course_grade_pref_3": "",
  "password": "$2a$08$72PLa6UW3UzqQ8BuEtcFPuBlJcVbuY/OFo9ODHi1kSJYxA.jt8ECC",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bedec8213676164c71a964"
  },
  "rollNumber": "p22ee007",
  "cgpa": null,
  "pref1": "eel2050",
  "course_grade_pref_1": "",
  "pref2": "eel7220",
  "course_grade_pref_2": "",
  "pref3": "phl2010",
  "course_grade_pref_3": "",
  "password": "$2a$08$bCgB1beCfV3TDCIxdkVqA.Rm.IjbybP5RQrndeqhpPYzbaQdB9WPq",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bf556f11a87dba93a329b0"
  },
  "rollNumber": "p20ee001",
  "cgpa": null,
  "pref1": "eel4040",
  "course_grade_pref_1": "",
  "pref2": "eel3090",
  "course_grade_pref_2": "",
  "pref3": "eel5060",
  "course_grade_pref_3": "",
  "password": "$2a$08$.vPbxj8b9ZEiNBSplYJExOxoNQ8DNv7UGmAdnhyr4HHNKfQ9blsZq",
  "__v": 0
},
{
  "_id": {
    "$oid": "64bf55c711a87dba93a329b5"
  },
  "rollNumber": "p20ee002",
  "cgpa": null,
  "pref1": "eel4040",
  "course_grade_pref_1": "",
  "pref2": "eel2020",
  "course_grade_pref_2": "",
  "pref3": "eel3090",
  "course_grade_pref_3": "",
  "password": "$2a$08$CjtxHbL4PAOIrB8bsnC2m.vjjDD8a3i5FAKWcujq/Vbrb0OdXfgS.",
  "__v": 0
}]

console.log(allotment(profs, tas));


