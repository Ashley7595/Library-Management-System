const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    fname : {type : String, required : true, trim : true},
    lname : {type : String, required : true, trim : true},
    email : {type : String, required : true},
    phone : {type : String, required : true},
    subject : {type : String, required : true},
    inquiry : {type : String, required : true},
    image : {type : Object},
    contactMethod : {type : String, required : true, enum : ['Email','Phone','Either']},
    consent : {type : String, required : true}
});

module.exports = new mongoose.model("Contact", UserSchema);