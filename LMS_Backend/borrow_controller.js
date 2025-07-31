const Borrow = require('./borrow_schema');
const Book = require('./book_schema');
const Teacher = require('./teacher_schema');
const Student = require('./student_schema');


const createBorrowRecord = async (req, res) => {
  try {
    const { bookId, teacherId, studentId, dueDate } = req.body;

   
    if (!bookId || !dueDate || (teacherId && studentId) || (!teacherId && !studentId)) {
      return res.status(400).json({ message: "Provide either teacherId or studentId, but not both or neither" });
    }

    if (isNaN(new Date(dueDate).getTime())) {
      return res.status(400).json({ message: "Invalid dueDate format" });
    }

    
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.status === true) {
      return res.status(400).json({ message: "Book is already borrowed" });
    }

  
    let borrower = null;
    let borrowerModel = null;

    if (teacherId) {
      borrower = await Teacher.findById(teacherId);
      if (!borrower) return res.status(400).json({ message: "Invalid teacher ID" });
      borrowerModel = 'Teacher';
    } else if (studentId) {
      borrower = await Student.findById(studentId);
      if (!borrower) return res.status(400).json({ message: "Invalid student ID" });
      borrowerModel = 'Student';
    }

    const activeBorrow = await Borrow.findOne({
      status: "borrowed",
      ...(teacherId ? { teacherId } : { studentId }),
    });

    if (activeBorrow) {
      return res.status(400).json({
        message: "You already borrowed a book. Return it before borrowing another."
      });
    }

    const borrowRecord = new Borrow({
      bookId,
      teacherId: teacherId || null,
      studentId: studentId || null,
      dueDate,
      status: 'borrowed',
      borrowedDate: new Date(),
    });

    book.status = true;
    book.borrowedBy = borrower._id;
    book.borrowedByModel = borrowerModel;
    await book.save();

    await borrowRecord.save();

    res.status(201).json({ message: "Book borrowed successfully", borrowRecord });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating borrow record' });
  }
};





const getAllBorrowRecords = async (req, res) => {
  try {
    const { teacherId, studentId, bookId, status, query } = req.query;
    const filters = {};

    if (teacherId) filters.teacherId = teacherId;
    if (studentId) filters.studentId = studentId;
    if (bookId) filters.bookId = bookId;
    if (status && ['borrowed', 'returned', 'overdue'].includes(status.toLowerCase())) {
      filters.status = status.toLowerCase();
    }

    const borrowRecords = await Borrow.find(filters)
      .populate('bookId', 'title status')
      .populate('teacherId', 'fname lname')
      .populate('studentId', 'fname lname');

    const formattedRecords = borrowRecords.map(record => {
      const currentDate = new Date();
      let statusLabel = record.status;

      if (record.status === 'borrowed' && new Date(record.dueDate) < currentDate) {
        statusLabel = 'overdue';
      }

      let borrowerName = '';
      if (record.teacherId) {
        borrowerName = `${record.teacherId.fname} ${record.teacherId.lname}`;
      } else if (record.studentId) {
        borrowerName = `${record.studentId.fname} ${record.studentId.lname}`;
      }

      return {
        id: record._id.toString(),
        borrowerName,
        bookTitle: record.bookId?.title || 'Unknown',
        borrowedDate: record.borrowedDate ? record.borrowedDate.toISOString().slice(0, 10) : null,
        dueDate: record.dueDate ? record.dueDate.toISOString().slice(0, 10) : null,
        status: statusLabel, 
      };
    }).filter(record => {
      if (!query) return true;

      const q = query.toLowerCase();
      return (
        record.bookTitle.toLowerCase().includes(q) ||
        record.borrowerName.toLowerCase().includes(q) ||
        record.status.toLowerCase().includes(q) ||
        record.dueDate?.toLowerCase().includes(q)
      );
    });

    res.status(200).json({ data: formattedRecords });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching borrow records' });
  }
};



const updateBorrowStatus = async (req, res) => {
  try {
    const { borrowId } = req.params;
    const { status, returnedDate } = req.body;

    if (!['borrowed', 'returned', 'overdue'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const borrowRecord = await Borrow.findById(borrowId);
    if (!borrowRecord) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    borrowRecord.status = status;

    if (status === 'returned') {
      borrowRecord.returnedDate = returnedDate || new Date();
      const book = await Book.findById(borrowRecord.bookId);
      book.status = false;
      book.borrowedBy = null;
      book.borrowedByModel = null;
      await book.save();
    }

    if (status === 'overdue') {
      const book = await Book.findById(borrowRecord.bookId);
      book.status = false;
      book.borrowedBy = null;
      book.borrowedByModel = null;
      await book.save();
    }

    await borrowRecord.save();
    res.status(200).json(borrowRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating borrow status' });
  }
};

const getBorrowRecordById = async (req, res) => {
  try {
    const { borrowId } = req.params;

    const borrowRecord = await Borrow.findById(borrowId)
      .populate('bookId', 'title')
      .populate('teacherId', 'name')
      .populate('studentId', 'name');

    if (!borrowRecord) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    res.status(200).json(borrowRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching borrow record' });
  }
};

const returnBook = async (req, res) => {
  try {
    const { bookId, teacherId, studentId } = req.body;

    if (!bookId || (!teacherId && !studentId)) {
      return res.status(400).json({ message: "Provide bookId and either teacherId or studentId" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const borrowRecord = await Borrow.findOne({
      bookId,
      $or: [
        teacherId ? { teacherId } : {},
        studentId ? { studentId } : {}
      ],
      status: "borrowed"
    });

    if (!borrowRecord) {
      return res.status(400).json({
        message: "No active borrow record found for this user and book"
      });
    }

    borrowRecord.status = "returned";
    borrowRecord.returnedDate = new Date();
    await borrowRecord.save();

    book.status = false;
    book.borrowedBy = null;
    book.borrowedByModel = null;
    await book.save();

    res.status(200).json({ message: "Book returned successfully", borrowRecord });

  } catch (error) {
    console.error("Error while returning book:", error);
    res.status(500).json({ message: "Server error while returning the book" });
  }
};

module.exports = {
  createBorrowRecord,
  getAllBorrowRecords,
  updateBorrowStatus,
  getBorrowRecordById,
  returnBook
};
