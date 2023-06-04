const { json } = require("body-parser");

function allotment(prof, ta) {
    const matching = [];
    const professorAssigned = {};
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



  
    // Helper function to check if a TA prefers a professor over the current assignment
    function prefersProfessor(ta, professor, currentProfessor) {
      const taPreferencesForProfessor = taPreferences[ta.rollNumber];
      return taPreferencesForProfessor.findIndex(entry => entry.courseCode === professor.courseCode) <
             taPreferencesForProfessor.findIndex(entry => entry.courseCode === currentProfessor.courseCode);
    }
  
    // Initialize professor and TA arrays
    const professors = prof.map(p => ({
      courseCode: p.courseCode,
      taRollNumbers: [p.taRollNumber1, p.taRollNumber2, p.taRollNumber3],
      branch: p.branch,
      theoryLab: p.theoryLab,
      noOfStudents: p.nof,
      cgpa: p.cgpa,
      courseGrade: p.courseGrade

    }));
    const tas = ta.map(t => ({
      rollNumber: t.rollNumber,
      preferences: [
        {courseCode: t.pref1, courseGrade: t.course_grade_pref_1},
        {courseCode: t.pref2, courseGrade: t.course_grade_pref_2},
        {courseCode: t.pref3, courseGrade: t.course_grade_pref_3}
      ],
      branch: t.branch,
      cgpa: t.cgpa,
    //   courseGrade: t.courseGrade
    }));
    
    // console.log("professors",professors);
    // console.log("tas",tas);

    // console.log(tas[0].preferences);
    // Create TA preferences object
    // const taPreferences = {};
    // ta.forEach(t => {
    //   taPreferences[t.rollNumber] = [];
    //   if (t.preferences) {  // Add a check to ensure preferences array exists
    //     t.preferences.forEach(p => {
    //       taPreferences[t.rollNumber].push(p);
    //     });
    //   }
    // });
    // console.log("taPreferences",taPreferences);
    // Assign TAs to professors based on preferences, branch, CGPA, and course grade
    // const unassignedProfessor = { ...professor };
    professors.forEach(professor => {
    //   const unassignedProfessor = { ...professor };
      studentPerTA = professor.theoryLab =="theory" ? 30 : 15;
      noOfTaRequired = Math.ceil(professor.noOfStudents/studentPerTA);

    //   console.log("noOfTaRequired",noOfTaRequired);
      let assignedTA = null;
      matching.push({ courseCode: professor.courseCode, expertTa: [], traineeTa: [] });
      // Check if any TA from the professor's preference list is available
      for (const taRollNumber of professor.taRollNumbers) {
        const taIndex = tas.findIndex(ta => ta.rollNumber === taRollNumber);
        if (taIndex !== -1 && !taAssigned[taRollNumber]) {
          const ta = tas[taIndex];
          assignedTA = ta;
        //   console.log("assignedTA",assignedTA);
        //   matching.push({ courseCode: professor.courseCode, expertTa: [], traineeTa: [] });
        if(noOfTaRequired>0){
            matching.find(m => m.courseCode === professor.courseCode).expertTa.push(ta.rollNumber);
            // matching.find(taRollNumber => taRollNumber.courseCode === professor.courseCode).expertTa.push(ta.rollNumber);
    
            console.log("matching",matching);
            taAssigned[ta.rollNumber] = true;
            noOfTaRequired--;
        }
        if(noOfTaRequired==0){
            break;
            }

        }
    }
    // console.log("matching",matching);
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
                cgpa:t.cgpa,
                courseGrade:t.preferences[0].courseGrade
            });
        }

        for(const t of tempTA1){
            eligibleTa.push({
                rollNumber:t.rollNumber,
                pref:t.preferences[1].courseCode,
                cgpa:t.cgpa,
                courseGrade:t.preferences[1].courseGrade
            });
        }

        for(const t of tempTA2){
            eligibleTa.push({
                rollNumber:t.rollNumber,
                pref:t.preferences[2].courseCode,
                cgpa:t.cgpa,
                courseGrade:t.preferences[2].courseGrade
            });
        }

        // console.log("eligibleTa",eligibleTa);

        //assignig the ta to the professor

        for(const t of eligibleTa){
            if(noOfTaRequired>0){
                matching.find(m => m.courseCode === professor.courseCode).traineeTa.push(t.rollNumber);
                taAssigned[t.rollNumber] = true;
                noOfTaRequired--;
            }
            if(noOfTaRequired==0){
                break;
            }
        }
    }    
    
      
    });


    jsonMatching = JSON.stringify(matching);
    // jsonMatching = JSON.parse(jsonMatching);
    return jsonMatching;
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
//       nof: 120,
//       theoryLab: 'theory',
//       cgpa: 8,
//       courseGrade: 'a',
//       taRollNumber1: 'b20ee011',
//       taRollNumber2: 'b20ee0123',
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
//       rollNumber: 'b20ee011',
//       cgpa: 9,
//       pref1: 'eel1010',
//       course_grade_pref_1: 'a',
//       pref2: 'eel1020',
//       course_grade_pref_2: 'a',
//       pref3: 'eel1030',
//       course_grade_pref_3: 'a-',
//       __v: 0
//     },
//     {
//     //   _id: new ObjectId("647b4fc05e59c516bc8bec85"),
//       rollNumber: 'b20cs010',
//       cgpa: 9,
//       pref1: 'csl1010',
//       course_grade_pref_1: 'a',
//       pref2: 'csl1020',
//       course_grade_pref_2: 'a',
//       pref3: 'csl1030',
//       course_grade_pref_3: 'a',
//       __v: 0
//     }
//   ];
  
//   const result = allotment(prof, ta);
//   console.log("result",result);
//   console.log(result);
