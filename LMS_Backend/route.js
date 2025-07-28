const express = require('express');
const route = express.Router();
const contactController = require('./contact_controller');
const teacherController = require('./teacher_controller');
const studentController = require('./student_controller');
const bookController = require('./book_controller');
const borrowController = require('./borrow_controller');

route.post('/addComplaints', contactController.contactImages, contactController.addComplaints);
route.get('/viewAllComplaints', contactController.viewAllComplaints);
route.get('/singleComplaint/:id', contactController.singleComplaint);
route.post('/updateComplaint/:id',contactController.contactImages, contactController.updateComplaint);
route.post('/deleteComplaint', contactController.deleteComplaint);

route.post('/addTeacher', teacherController.teacherImages, teacherController.addTeacher);
route.get('/viewAllTeachers', teacherController.viewAllTeachers);
route.get('/singleTeacher/:id', teacherController.singleTeacher);
route.post('/updateTeacher/:id',teacherController.teacherImages, teacherController.updateTeacher);
route.post('/deleteTeacher', teacherController.deleteTeacher);
route.post("/loginTeacher", teacherController.loginTeacher);
route.post("/viewStudentsByTeacher", teacherController.viewStudentsByTeacher);

route.post('/addStudent', studentController.studentImages, studentController.addStudent);
route.get('/viewAllStudents', studentController.viewAllStudents);
route.get('/singleStudent/:id', studentController.singleStudent);
route.post('/updateStudent/:id',studentController.studentImages, studentController.updateStudent);
route.post('/deleteStudent', studentController.deleteStudent);
route.post("/loginStudent", studentController.loginStudent);
route.post("/viewStudentsByTeacher", studentController.viewStudentsByTeacher);

route.post('/addBook', bookController.bookImages, bookController.addBook);
route.get('/viewAllBooks', bookController.viewAllBooks);
route.get('/singleBook/:id', bookController.singleBook);
route.post('/updateBook/:id',bookController.bookImages, bookController.updateBook);
route.post('/deleteBook', bookController.deleteBook);
route.post('/borrowBook', bookController.borrowBook);
route.post('/returnBorrowedBook/:id', bookController.returnBook);

route.post('/createBorrowRecord', borrowController.createBorrowRecord);
route.get('/getAllBorrowRecords', borrowController.getAllBorrowRecords);
route.get('/getBorrowRecordById/:borrowId', borrowController.getBorrowRecordById);
route.post('/updateBorrowStatus/:borrowId', borrowController.updateBorrowStatus);
route.post('/returnBook', borrowController.returnBook);

module.exports = route