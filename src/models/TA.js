const mongoose = require('mongoose');


const taSchema = mongoose.Schema({
    rollNumber : {
        type : String,
        trim : true,
        lowercase : true,
        required : true
    },
    pref1 : {
        type : String,
        trim : true, 
        lowercase : true,
        required : true
    },
    pref2 : {
        type : String,
        trim : true, 
        lowercase : true,
        required : true
    },
    pref3 : {
        type : String,
        trim : true, 
        lowercase : true,
        required : true
    }
});

const TA = mongoose.model('TA', taSchema)
 
module.exports = TA