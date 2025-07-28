const schema = require('./teacher_schema');
const Student = require('./student_schema');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./teacher");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const teacherImages = multer({ storage: storage }).single("image");

const addTeacher = (req, res) => {
  const { fname, lname, email, phone, subject, joinDate,
    username, password, dob } = req.body;

  const image = req.file ? req.file.filename : "";

  let teacher = new schema({
    fname: fname,
    lname: lname,
    email: email,
    phone: phone,
    subject: subject,
    joinDate: joinDate,
    username: username,
    password: password,
    dob: dob,
    image: image,
  });

  teacher.save()
    .then(result => {
      res.json({ message: "Teacher Added", data: result });
    })
    .catch(error => {
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue)[0];
        const message = `${duplicateField} already exists`;
        return res.status(400).json({ error: message });
      }

      res.status(500).json({ error: "Server error" });
    });
}

const viewAllTeachers = (req, res) => {
  schema.find()

    .then((result) => {
      res.json({
        message: "View All Teachers",
        data: result
      })
    })
    .catch((error) => {
      console.log(error);
    })
}

const singleTeacher = (req, res) => {
  schema.findById({
    _id: req.params.id
  })

    .then((result) => {
      res.json({
        message: "Found One Teacher",
        data: result
      })
    })
    .catch((error) => {
      console.log(error);
    })
}

const updateTeacher = async (req, res) => {
  try {
    const updateData = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      joinDate: req.body.joinDate,
      username: req.body.username,
      password: req.body.password,
      dob: req.body.dob,
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
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({
      message: "Teacher Updated",
      data: updated
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const deleteTeacher = (req, res) => {
  schema.findByIdAndDelete({ _id: req.body.id })
    .then((result) => {
      res.json({
        message: "Teacher Deleted",
        data: result
      })
    })
    .catch((error) => {
      console.log(error);
    })
};

const loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  try {
    const teacher = await schema.findOne({ email });

    if (!teacher) {
      return res.status(401).json({ message: "Email not found" });
    }

    if (teacher.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful", data: teacher });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const viewStudentsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.body;
    const students = await Student.find({ createdBy: teacherId });
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


module.exports = { addTeacher, viewAllTeachers, singleTeacher, updateTeacher, deleteTeacher, loginTeacher, viewStudentsByTeacher, teacherImages }