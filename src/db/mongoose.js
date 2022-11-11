//ALREADY EXISTED

// const mongoose = require('mongoose');

// const connectionUrl = process.env.MONGODB_URL;


// mongoose.connect(connectionUrl, {
//     useNewUrlParser : true
// });
const mongoose = require('mongoose');

// const connectionUrl = 'mongodb://127.0.0.1:27017/TA-allocation';
const connectionUrl = 'mongodb+srv://admin:admin@cluster0.0nk9cwk.mongodb.net/test';

// const connectionURL
mongoose.connect(connectionUrl, {
    useNewUrlParser : true
});

//ADDED BY US

// const {MongoClient} = require('mongodb')
// const url = 'mongodb://localhost:27017';
// const databasename ='TA_alloc';
// const client = new MongoClient(url);

// async function getData(){
//     let result= await client.connect();
//     db= result.db(databasename);
//     collection = db.collection('products');
//     let data =await collection.find({}).toArray();
//     console.log(data)

// }
// getData();

//CODE WITH HARRY
// var mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/taalloc', {useNewUrlParser: true, useUnifiedTopology: true});
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     // we're connected!
//     console.log("Connected to database")
//     });
    