const mongoose = require("mongoose");

const BorrowSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", default: null },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null },
  borrowedDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnedDate: { type: Date, default: null },
  status: {
    type: String,
    enum: ["borrowed", "returned", "overdue"],
    default: "borrowed"
  }
});


module.exports = mongoose.model("Borrow", BorrowSchema);


