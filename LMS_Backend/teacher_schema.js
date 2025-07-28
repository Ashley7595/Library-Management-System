const mongoose = require("mongoose");
const TeacherSchema = new mongoose.Schema({
    fname : {type : String, required : true, trim : true},
    lname : {type : String, required : true, trim : true},
    email : {type : String, required : true, unique : true}, 
    phone : {type : String, required : true, unique : true},
    subject : {type: String, required : true},
    joinDate : {type: String, required : true},
    username : {type : String, required : true},
    password : {type : String, required : true},
    dob : {type : Date, required : true},
    image : {type : Object},
});

module.exports = new mongoose.model("Teacher", TeacherSchema);