
function allotment(prof, ta) {
    /* 
    prof = array of objects with following properties
    __id,
    courseCode,             type string
    ugPg,                          string 
    electiveCore,                  string
    needToAttend,                  string 
    taRollNumber1,                 string
    taRollNumber2,                 string
    taRollNumber3,                 string
    nof,                           number
    theorylab                      string

    ta = array of objects with following properties
    rollNumber,              string
    pref1,                   string
    pref2,                   string
    pref3,                   string
    expert1,                 string
    expert2,                 string
    expert3                  string

    NOTE: If some entry is not provided then it is an empty string
    */
    /*
    return an object with following properties
    courseCode,
    expertTa,
    traineeTa
    */

    const ceel = (a, b) => {
        var c = 15;
        if (b == 'theory') c = 30;
        var ans = a / c;
        return Math.ceil(ans);
    }

    

    var profarr = [];
    var taarr = [];
    var cap = {};

    var n = prof.length, m = ta.length;
    for (var i = 0; i < n; i++) {
        profarr.push(prof[i].courseCode);

        cap[prof[i].courseCode] = ceel(prof[i].nof, prof[i].theoryLab);
    }
    for (var i = 0; i < m; i++) {
        taarr.push(ta[i].rollNumber)
    }
    var A = {};
    var B = {};


    var checkIfPresent = (arr, s) => {
        for (var i = 0; i < arr.length; i++) {
            if (s === arr[i]) return false;
        }
        return true;
    }

    for (var i = 0; i < profarr.length; i++) {
        A[profarr[i]] = [];
        if (prof[i].taRollNumber1 != "") {
            for (var j = 0; j < taarr.length; j++){
                if (taarr[j].length >= prof[i].taRollNumber1.length) {
                    var flag3 = 0;
                    for (var k = 0; k < prof[i].taRollNumber1.length; k++){
                        if ((prof[i].taRollNumber1)[k] !== taarr[j][k]) {
                            flag3 = 1;
                            break;
                        }
                    }
                    
                    if (flag3 === 0 && checkIfPresent(A[profarr[i]],taarr[j])) {
                        A[profarr[i]].push(taarr[j]);
                    }
                }
            }
        }

        if (prof[i].taRollNumber2 != "") {
            for (var j = 0; j < taarr.length; j++){
                if (taarr[j].length >= prof[i].taRollNumber2.length) {
                    var flag4 = 0;
                    for (var k = 0; k < prof[i].taRollNumber2.length; k++){
                        if ((prof[i].taRollNumber2)[k] !== taarr[j][k]) {
                            flag4 = 1;
                            break;
                        }
                    }
                    if (flag4 === 0 && checkIfPresent(A[profarr[i]],taarr[j])) {
                        A[profarr[i]].push(taarr[j]);
                    }
                }
            }
        }

        if (prof[i].taRollNumber3 != "") {
            for (var j = 0; j < taarr.length; j++){
                if (taarr[j].length >= prof[i].taRollNumber3.length) {
                    var flag5 = 0;
                    for (var k = 0; k < prof[i].taRollNumber3.length; k++){
                        if ((prof[i].taRollNumber3)[k] !== taarr[j][k]) {
                            flag5 = 1;
                            break;
                        }
                    }
                    if (flag5 === 0 && checkIfPresent(A[profarr[i]],taarr[j])) {
                        A[profarr[i]].push(taarr[j]);
                    }
                }
            }
        }
        for (var j = 0; j < m; j++) {
            var flag = true;
            for (var k = 0; k < A[profarr[i]].length; k++) {
                if (A[profarr[i]][k] === taarr[j]) flag = false;
            }
            if (flag) {
                A[profarr[i]].push(taarr[j]);
            }
        }
    }
    /////////////////////////////////////////


    for (var i = 0; i < taarr.length; i++) {
        B[taarr[i]] = [];
        if (ta[i].pref1 != "" && !checkIfPresent(profarr, ta[i].pref1)) B[taarr[i]].push(ta[i].pref1);
        if (ta[i].pref2 != "" && !checkIfPresent(profarr, ta[i].pref2)) B[taarr[i]].push(ta[i].pref2);
        if (ta[i].pref3 != "" && !checkIfPresent(profarr, ta[i].pref3)) B[taarr[i]].push(ta[i].pref3);
        for (var j = 0; j < n; j++) {
            var flag = true;
            for (var k = 0; k < B[taarr[i]].length; k++) {
                if (B[taarr[i]][k] === profarr[j]) flag = false;
            }
            if (flag) {
                B[taarr[i]].push(profarr[j]);
            }
        }
    }


    ///////////////////////////////////


    var match = {};
    for (var i = 0; i < m; i++) match[taarr[i]] = [];

    var courseCounter = {};
    for (var i = 0; i < profarr.length; i++) courseCounter[profarr[i]] = 0;
    while (true) {
        var rem = [];
        for (var i = 0; i < n; i++) rem.push(profarr[i]);
        var count = 0
        while (rem.length !== 0) {
            var course = rem[0];

            //////

            if (courseCounter[course] >= cap[course]) {
                rem.shift();
                continue;
            }
            for (var j = 0; j < A[course].length; j++) {
                var a = A[course][j];
                var already_have = false;
                for (var id =  0; id < match[a].length; id++) {
                    if (match[a][id] == course) already_have = true;
                }
                if (already_have) continue;
                if (match[a].length < 3) {
                    match[a].push(course);
                    courseCounter[course]++;
                    count++;
                    break;
                } else {
                    var temp = [-1, -1, -1];
                    var apref

                    for (var k = B[a].length - 1; k >= 0; k--) {

                        for (var e = 0; e < 3; e++) {
                            if (match[a][e] == B[a][k]) {
                                temp[e] = k;
                            }
                        }
                        if (a == B[a][k]) apref = k;
                    }
                    var f = 0;
                    for (var k = 0; k < 3; k++) {
                        if (apref == temp[k]) f = 1;
                    }
                    if (f === 1) continue;
                    var ind = 0
                    for (var k = 1; k < 3; k++) {
                        if (temp[k] > temp[ind]) {
                            ind = k;
                        }
                    }
                    if (temp[ind] > apref) {
                        courseCounter[match[a][ind]]--;
                        match[a][ind] = course;
                        courseCounter[course]++;
                        count++;
                        break;
                    }
                }
            }

            rem.shift();
        }
        if (count === 0) {
            break
        }
    }
    var match2 = {}
    for (var i = 0; i < profarr.length; i++) match2[profarr[i]] = [];
    for (var i = 0; i < taarr.length; i++){
        for (var j = 0; j < match[taarr[i]].length; j++){
            match2[match[taarr[i]][j]].push(taarr[i]);
        }
    }
    for (var i = 0; i < taarr.length; i++){
        match2[taarr[i]] = match[taarr[i]]
    }
    match2 = JSON.stringify(match2);
    match2 = '['+match2+']';
    //convert match2 to json again
    match2 = JSON.parse(match2);
    //for loop on match2, convert value of each key to string
    for (var i = 0; i < match2.length; i++){
        for (var key in match2[i]){
            match2[i][key] = match2[i][key].toString();
        }
    }
    
    return match2;
    // return match;
}



module.exports = allotment;
