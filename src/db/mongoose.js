const mongoose = require('mongoose');

const connectionUrl = process.env.MONGODB_URL;


// const connectionURL
mongoose.connect(connectionUrl, {
    useNewUrlParser : true
});