require('./teacher_schema');
require('./student_schema');
const Book = require('./book_schema');
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './book');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Prevent duplicate names
    }
});

const bookImages = multer({ storage: storage }).single("image");

const addBook = async (req, res) => {
    try {
        const { title, author, year, genre, language } = req.body;
        const image = req.file ? req.file.filename : null;

        const book = new Book({
            title,
            author,
            year,
            genre,
            language,
            image,
            status: false,
            borrowedBy: null,
            borrowedByModel: null
        });

        const saved = await book.save();
        res.status(201).json({
            message: "New Book Added",
            data: saved
        });
    } catch (error) {
        console.error("Add book error:", error);
        res.status(500).json({ message: "Failed to add book", error: error.message });
    }
};


const viewAllBooks = async (req, res) => {
  try {
    const books = await Book.find({}).populate({
  path: "borrowedBy",
  select: "_id fname lname",
});


    res.json({ data: books });
  } catch (error) {
    console.error("Fetch books error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




const singleBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });

        res.json({
            message: "Found One Book",
            data: book
        });
    } catch (error) {
        console.error("Fetch single book error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const updateBook = async (req, res) => {
    try {
        const updateData = {
            title: req.body.title,
            author: req.body.author,
            year: req.body.year,
            genre: req.body.genre,
            language: req.body.language,
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updated = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updated) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({
            message: "Book Updated",
            data: updated
        });
    } catch (error) {
        console.error("Update book error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const deleteBook = async (req, res) => {
    try {
        const deleted = await Book.findByIdAndDelete(req.body.id);
        if (!deleted) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({
            message: "Book Deleted",
            data: deleted
        });
    } catch (error) {
        console.error("Delete book error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const borrowBook = async (req, res) => {
    try {
        const { bookId, userId, userType } = req.body;

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });
        if (book.status === true) return res.status(400).json({ message: "Book is already borrowed" });

        book.status = true;
        book.borrowedBy = userId;
        book.borrowedByModel = userType; // "Student" or "Teacher"

        await book.save();

        res.json({ message: "Book borrowed successfully", data: book });
    } catch (err) {
        console.error("Borrow error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


const returnBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });

        book.status = false;
        book.borrowedBy = null;
        book.borrowedByModel = null;

        await book.save();

        res.json({ message: "Book returned successfully", data: book });
    } catch (err) {
        console.error("Return error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

module.exports = {
    addBook,
    viewAllBooks,
    singleBook,
    updateBook,
    deleteBook,
    bookImages,
    borrowBook,
    returnBook
};
