var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";
var url = "mongodb+srv://admin:admin@cluster0.0nk9cwk.mongodb.net/test";


// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { id: "B20CS019", password: "xyz" };
//   dbo.collection("id_tas").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { id: "B20CS067", password: "abc" };
//   dbo.collection("id_tas").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { id: "admin", password: "admin" };
//   dbo.collection("id_admins").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { id: "admin", password: "admin" };
//   dbo.collection("id_admins").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { id: "csl1010", password: "harshi" };
//   dbo.collection("id_profs").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });


// // MongoClient.connect(url, function(err, db) {
// //   if (err) throw err;
// //   var dbo = db.db("test");
// //   var myobj = { id: "Sumit", password: "sumit" };
// //   dbo.collection("id_profs").insertOne(myobj, function(err, res) {
// //     if (err) throw err;
// //     console.log("1 document inserted");
// //     db.close();
// //   });
// // });


// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { courseCode: "csl1010", ugPg: "ug", electiveCore: "elective", needToAttend: 1, nof: 2, theoryLab: "theory", taRollNumber1: "B20CS067", taRollNumber2: "B20CS019", taRollNumber3: "B20CS016" };
//   dbo.collection("profs").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { courseCode: "csl1011", ugPg: "pg", electiveCore: "ele2", needToAttend: 1, nof: 2, theoryLab: "theory", taRollNumber1: "B20CS063", taRollNumber2: "B20CS020", taRollNumber3: "B20CS021" };
//   dbo.collection("profs").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });


// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { courseCode: "csl1012", ugPg: "pg", electiveCore: "ele2", needToAttend: 0, nof: 2, theoryLab: "theory", taRollNumber1: "B20CS063", taRollNumber2: "B20CS020", taRollNumber3: "B20CS021" };
//   dbo.collection("profs").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });



// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { courseCode: "csl1013", ugPg: "pg", electiveCore: "ele2", needToAttend: 1, nof: 2, theoryLab: "theory", taRollNumber1: "B20CS063", taRollNumber2: "B20CS020", taRollNumber3: "B20CS021" };
//   dbo.collection("profs").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { courseCode: "csl1014", ugPg: "ug", electiveCore: "elective", needToAttend: 0, nof: 2, theoryLab: "theory", taRollNumber1: "B20CS067", taRollNumber2: "B20CS019", taRollNumber3: "B20CS016" };
//   dbo.collection("profs").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { courseCode: "csl1015", ugPg: "pg", electiveCore: "ele2", needToAttend: 1, nof: 2, theoryLab: "theory", taRollNumber1: "B20CS063", taRollNumber2: "B20CS020", taRollNumber3: "B20CS021" };
//   dbo.collection("profs").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });


// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { courseCode: "csl1016", ugPg: "pg", electiveCore: "ele2", needToAttend: 1, nof: 2, theoryLab: "theory", taRollNumber1: "B20CS063", taRollNumber2: "B20CS020", taRollNumber3: "B20CS021" };
//   dbo.collection("profs").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { courseCode: "csl1017", ugPg: "ug", electiveCore: "elective", needToAttend: 0, nof: 2, theoryLab: "theory", taRollNumber1: "B20CS067", taRollNumber2: "B20CS019", taRollNumber3: "B20CS016" };
//   dbo.collection("profs").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { courseCode: "csl1018", ugPg: "pg", electiveCore: "ele2", needToAttend: 1, nof: 2, theoryLab: "theory", taRollNumber1: "B20CS063", taRollNumber2: "B20CS020", taRollNumber3: "B20CS021" };
//   dbo.collection("profs").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });


// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { courseCode: "csl1019", ugPg: "pg", electiveCore: "ele2", needToAttend: 1, nof: 2, theoryLab: "theory", taRollNumber1: "B20CS063", taRollNumber2: "B20CS020", taRollNumber3: "B20CS021" };
//   dbo.collection("profs").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { rollNumber: "B20CS001", pref1: "csl1010", pref2: "csl1013", pref3: "csl1012" };
//   dbo.collection("tas").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { rollNumber: "B20CS002", pref1: "csl1011", pref2: "csl1012", pref3: "csl1010" };
//   dbo.collection("tas").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { rollNumber: "B20CS003", pref1: "csl1011", pref2: "csl1018", pref3: "csl1017" };
//   dbo.collection("tas").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { rollNumber: "B20CS004", pref1: "csl1014", pref2: "csl1015", pref3: "csl1010" };
//   dbo.collection("tas").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { rollNumber: "B20CS005", pref1: "csl1016", pref2: "csl1013", pref3: "csl1012" };
//   dbo.collection("tas").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { rollNumber: "B20CS006", pref1: "csl1014", pref2: "csl1015", pref3: "csl1011" };
//   dbo.collection("tas").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { rollNumber: "B20CS007", pref1: "csl1011", pref2: "csl1014", pref3: "csl1010" };
//   dbo.collection("tas").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { rollNumber: "B20CS008", pref1: "csl1013", pref2: "csl1012", pref3: "csl1017" };
//   dbo.collection("tas").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("test");
//   var myobj = { rollNumber: "B20CS009", pref1: "csl1013", pref2: "csl1015", pref3: "csl1011" };
//   dbo.collection("tas").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("test");
  var myobj = { rollNumber: "B20CS019", pref1: "csl1020", pref2: "csl1021", pref3: "csl1022" };
  dbo.collection("tas").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});