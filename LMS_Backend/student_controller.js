const schema = require('./student_schema');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "./student");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const studentImages = multer({ storage: storage }).single("image");

const addStudent = (req, res) => {
    const { fname, lname, dob, gender, email, phone, studclass, rollNumber,
        username, password, joinDate, teacherId
    } = req.body;

    const image = req.file ? req.file.filename : "";

    let student = new schema({
        fname: fname,
        lname: lname,
        dob: dob,
        gender: gender,
        email: email,
        phone: phone,
        studclass: studclass,
        rollNumber: rollNumber,
        username: username,
        password: password,
        joinDate: joinDate,
        image: image,
        createdBy: teacherId
    });

    student.save()

        .then((result) => {
            res.json({
                message: "New Student Added",
                data: result
            })
        })
        .catch((error) => {
            console.log(error);
        })
}

const viewAllStudents = (req, res) => {
    schema.find()

        .then((result) => {
            res.json({
                message: "View All Students",
                data: result
            })
        })
        .catch((error) => {
            console.log(error);
        })
}

const singleStudent = (req, res) => {
    schema.findById({
        _id: req.params.id
    })

        .then((result) => {
            res.json({
                message: "Found One Student",
                data: result
            })
        })
        .catch((error) => {
            console.log(error);
        })
}

const updateStudent = async (req, res) => {
    try {
        const updateData = {
            fname: req.body.fname,
            lname: req.body.lname,
            dob: req.body.dob,
            gender: req.body.gender,
            email: req.body.email,
            phone: req.body.phone,
            studclass: req.body.studclass,
            rollNumber: req.body.rollNumber,
            username: req.body.username,
            password: req.body.password,
            joinDate: req.body.joinDate,
            image: req.body.image,
            createdBy: req.body.teacherId
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updated = await schema.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({
            message: "Student Updated",
            data: updated
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const deleteStudent = (req, res) => {
    schema.findByIdAndDelete({ _id: req.body.id })
        .then((result) => {
            res.json({
                message: "Student Deleted",
                data: result
            })
        })
        .catch((error) => {
            console.log(error);
        })
};

const loginStudent = async (req, res) => {
    const { email, password } = req.body;

    try {
        const student = await schema.findOne({ email });

        if (!student) {
            return res.status(401).json({ message: "Email not found" });
        }

        if (student.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        res.status(200).json({ message: "Login successful", data: student });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const viewStudentsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.body;
    const students = await schema.find({ createdBy: teacherId });
    res.json({ success: true, data: students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { addStudent, viewAllStudents, singleStudent, updateStudent, deleteStudent, loginStudent, viewStudentsByTeacher, studentImages }