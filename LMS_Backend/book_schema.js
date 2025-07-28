const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: String, required: true },
  genre: { type: String, required: true },
  language: { type: String, required: true },
  image: { type: Object },
  status: { 
    type: Boolean, 
    default: false 
  },
 borrowedBy: {
  type: mongoose.Schema.Types.ObjectId,
  refPath: 'borrowedByModel',
  default: null
},
borrowedByModel: {
  type: String,
  enum: ['Student', 'Teacher'],
  default: null
}

});

module.exports = mongoose.model("Book", BookSchema);
