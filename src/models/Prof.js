const mongoose = require('mongoose');


const profSchema = mongoose.Schema({
    courseCode : {
        type : String,
        trim : true,
        lowercase : true,
        required : true
    },
    ugPg : {
        type : String, 
        trim : true,
        lowercase : true,
        required : true
    },
    electiveCore : {
        type : String,
        trim : true,
        lowercase : true,
        required : true
    },
    needToAttend : {
        type : Number,
        default : 1,
        validate(value) {
            if (value < 0) {
                throw new Error('value must be positive');
            }
        }
    },
    nof : {
        type : Number,
        required : true
    },
    theoryLab : {
        type : String,
        trim : true,
        lowercase : true,
        required : true
    },
    taRollNumber1 : {
        type : String,
        trim : true,
        lowercase : true
    },
    taRollNumber2 : {
        type : String,
        trim : true,
        lowercase : true
    },
    taRollNumber3 : {
        type : String,
        trim : true,
        lowercase : true
    }
});

const PROF = mongoose.model('PROF', profSchema)
 
module.exports = PROF