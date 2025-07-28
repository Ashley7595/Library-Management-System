const mongoose = require("mongoose");
const StudentSchema = new mongoose.Schema({
    fname : {type : String, required : true, trim : true},
    lname : {type : String, required : true, trim : true},
    dob : {type : Date, required : true},
    gender :{type : String, required : true, enum : ['Male','Female']},
    email : {type : String, required : true, unique : true}, 
    phone : {type : String, required : true, unique : true},
    studclass : {type : String, required : true},
    rollNumber : {type : String, required : true},
    username : {type : String, required : true},
    password : {type : String, required : true},
    joinDate : {type: String, required : true},
    image : {type : String},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
});

module.exports = new mongoose.model("Student", StudentSchema);