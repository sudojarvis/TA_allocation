const { disable } = require('express/lib/application');
const mongoose = require('mongoose');
const connectionUrl = 'mongodb+srv://admin:admin@cluster0.0nk9cwk.mongodb.net/test';

mongoose.connect(connectionUrl, {
    useNewUrlParser : true
});

const taSchema = mongoose.Schema({
    rollNumber: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true, // Add this line if roll numbers should be unique
    },
    cgpa: {
      type: Number,
      // required: true,
      max: 10,
      
    },
    pref1: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    course_grade_pref_1: {
      type: String,
      trim: true,
      lowercase: true,
      // required: true,
    },
    pref2: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    course_grade_pref_2: {
      type: String,
      trim: true,
      lowercase: true,
      // required: true,
    },
    pref3: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    course_grade_pref_3: {
      type: String,
      trim: true,
      lowercase: true,
      // required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  });
  
const TA = mongoose.model('TA', taSchema)
 
module.exports = TA
