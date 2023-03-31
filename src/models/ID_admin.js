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

const ID_admin = mongoose.model('ID_admin', idSchema)
module.exports = ID_admin
