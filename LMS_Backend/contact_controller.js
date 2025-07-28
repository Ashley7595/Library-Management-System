const schema = require('./contact_schema');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./contact");  
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); 
  }
});


const contactImages = multer({ storage: storage }).single("image");


const addComplaints = (req, res) => {
  const {
    fname, lname, email, phone,
    subject, inquiry, contactMethod, consent
  } = req.body;

  const image = req.file ? req.file.filename : "";

  const contact = new schema({
    fname,
    lname,
    email,
    phone,
    subject,
    inquiry,
    image,
    contactMethod,
    consent
  });

  contact.save()
    .then((result) => {
      res.json({ message: "Complaint Added", data: result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error saving complaint", error });
    });
};


const viewAllComplaints = (req, res) => {
  schema.find()
    .then((result) => {
      res.json({ message: "View All Complaints", data: result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error fetching complaints", error });
    });
};


const singleComplaint = (req, res) => {
  schema.findById(req.params.id)
    .then((result) => {
      res.json({ message: "Found One Complaint", data: result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error fetching complaint", error });
    });
};


const updateComplaint = async (req, res) => {
  try {
    const updateData = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      inquiry: req.body.inquiry,
      contactMethod: req.body.contactMethod,
      consent: req.body.consent
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await schema.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Complaint Not Found" });
    }

    res.json({ message: "Complaint Updated", data: updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const deleteComplaint = (req, res) => {
  schema.findByIdAndDelete(req.body.id)
    .then((result) => {
      res.json({ message: "Complaint Deleted", data: result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Error deleting complaint", error });
    });
};

module.exports = {addComplaints,viewAllComplaints,singleComplaint, updateComplaint,deleteComplaint,contactImages};
