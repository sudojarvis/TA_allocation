const mongoose = require('mongoose');


const idSchema = mongoose.Schema({
    id : {
        type : String,
        trim : true,
        lowercase : true,
        required : true
    },
    password : {
        type : String, 
        trim : true,
        lowercase : true,
        required : true
    }
});

const ID_Ta = mongoose.model('ID_Ta', idSchema)
 
module.exports = ID_Ta