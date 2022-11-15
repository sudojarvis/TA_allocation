var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";
var url = "mongodb+srv://admin:admin@cluster0.0nk9cwk.mongodb.net/test";


MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("TA_alloc");
  var myobj = { id: "B20CS016", password: "abcd" };
  dbo.collection("id_ta").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});