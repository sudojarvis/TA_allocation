// const mongoose = require('mongoose');

// const connectionUrl = process.env.MONGODB_URL;


// // const connectionURL
// mongoose.connect(connectionUrl, {
//     useNewUrlParser : true
// });

const {MongoClient} = require('mongodb')
const url = 'mongodb://localhost:27017';
const databasename ='taalloc';
const client = new MongoClient(url);

async function getData(){
    let result= await client.connect();
    db= result.db(databasename);
    collection = db.collection('products');
    let data =await collection.find({}).toArray();
    console.log(data)

}
getData();