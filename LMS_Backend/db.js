const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1/LMS')

let db = mongoose.connection
db.on('error',console.error.bind('error'));

db.once('open', ()=>{
    console.log("Database Connected");
});

module.exports = db