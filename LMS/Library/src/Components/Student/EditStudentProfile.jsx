import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  useTheme,
  Typography,
  Select,
} from "@mui/material";
import { tokens } from "./Theme";
import Header from "./Global/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function EditStudentProfile() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [edit, setEdit] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    studclass: "",
    rollNumber: "",
    username: "",
    image: null,
  });

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) return;

    const student = JSON.parse(storedStudent);
    const studentId = student._id;

    axios
      .get(`http://localhost:5001/singleStudent/${studentId}`)
      .then((result) => {
        const studentData = result.data.data;
        const formattedDob = studentData.dob ? studentData.dob.split("T")[0] : "";
        setEdit({
          ...studentData,
          dob: formattedDob,
        });
        setImagePreview(`http://localhost:5001/student/${studentData.image}`);
      })
      .catch(console.error);
  }, []);

  const validateField = (field, values) => {
    const errs = { ...errors };
    const digitsOnly = values.phone.replace(/[^\d]/g, "");
    const dobDate = new Date(values.dob);
    const today = new Date();
    const age =
      today.getFullYear() -
      dobDate.getFullYear() -
      (today.getMonth() < dobDate.getMonth() ||
      (today.getMonth() === dobDate.getMonth() && today.getDate() < dobDate.getDate())
        ? 1
        : 0);

    switch (field) {
      case "fname":
        if (!values.fname.trim()) errs.fname = "First name is required";
        else if (!/^[A-Za-z\s]+$/.test(values.fname)) errs.fname = "First name must contain only letters";
        else delete errs.fname;
        break;
      case "lname":
        if (!values.lname.trim()) errs.lname = "Last name is required";
        else if (!/^[A-Za-z\s]+$/.test(values.lname)) errs.lname = "Last name must contain only letters";
        else delete errs.lname;
        break;
      case "email":
        if (!values.email.trim()) errs.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(values.email)) errs.email = "Invalid email address";
        else delete errs.email;
        break;
      case "phone":
        if (!digitsOnly) errs.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(digitsOnly)) errs.phone = "Phone must contain exactly 10 digits";
        else delete errs.phone;
        break;
      case "dob":
        if (!values.dob) errs.dob = "Date of birth is required";
        else if (isNaN(dobDate.getTime())) errs.dob = "Invalid date format";
        else if (age < 5 || age > 18) errs.dob = "Age must be between 5 and 18 years";
        else delete errs.dob;
        break;
      case "studclass":
        const classNum = parseInt(values.studclass, 10);
        if (!values.studclass) errs.studclass = "Class is required";
        else if (isNaN(classNum) || classNum < 1 || classNum > 12) errs.studclass = "Class must be between 1 and 12";
        else delete errs.studclass;
        break;
      case "gender":
        if (!values.gender.trim()) errs.gender = "Gender is required";
        else if (!/^[A-Za-z\s]+$/.test(values.gender)) errs.gender = "Gender must contain only letters";
        else delete errs.gender;
        break;
      case "username":
        if (!values.username.trim()) errs.username = "Username is required";
        else delete errs.username;
        break;
      case "rollNumber":
        const roll = parseInt(values.rollNumber);
        if (isNaN(roll) || roll < 1 || roll > 1000) errs.rollNumber = "Roll Number must be 1–1000";
        else delete errs.rollNumber;
        break;
      default:
        break;
    }

    setErrors(errs);
  };

  const validate = () => {
    Object.keys(edit).forEach((field) => validateField(field, edit));
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const storedStudent = JSON.parse(localStorage.getItem("student"));
    const studentId = storedStudent._id;

    const formData = new FormData();
    Object.keys(edit).forEach((key) => {
      if (key === "image" && !(edit.image instanceof File)) return;
      formData.append(key, edit[key]);
    });

    try {
      const response = await axios.post(
        `http://localhost:5001/updateStudent/${studentId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Profile Updated Successfully");
      localStorage.setItem("student", JSON.stringify(response.data.data));
      setTimeout(() => navigate("/StudentProfile"), 1500);
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed To Update Profile");
    }
  };

  const handleChange = (id, value) => {
    let filteredValue = value;

    if (["fname", "lname", "gender"].includes(id)) {
      filteredValue = value.replace(/[^A-Za-z\s]/g, "");
    } else if (["phone", "studclass", "rollNumber"].includes(id)) {
      filteredValue = value.replace(/[^\d]/g, "");
    } else if (id === "email") {
      filteredValue = value.replace(/[^a-zA-Z0-9@._+-]/g, "");
    }

    setEdit((prev) => {
      const updated = { ...prev, [id]: filteredValue };
      validateField(id, updated);
      return updated;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      const errs = { ...errors };

      if (!validTypes.includes(file.type)) {
        errs.image = "Only JPG/PNG allowed";
      } else if (file.size > 2 * 1024 * 1024) {
        errs.image = "Image must be under 2MB";
      } else {
        delete errs.image;
      }

      setErrors(errs);
      setEdit({ ...edit, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const fields = [
    { label: "First Name", id: "fname" },
    { label: "Last Name", id: "lname" },
    { label: "Email", id: "email" },
    { label: "Phone Number", id: "phone" },
    { label: "DOB", id: "dob", type: "date" },
    { label: "", id: "gender", type: "select", options: ["Male", "Female", "Other"] },
    { label: "Class", id: "studclass" },
    { label: "Roll Number", id: "rollNumber" },
    { label: "Username", id: "username" },
  ];

  return (
    <Box p={2}>
      <Box mb={4} textAlign="center">
        <Header title="Edit Profile" />
      </Box>

      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Box
          width="100%"
          maxWidth="500px"
          p={4}
          borderRadius="16px"
          boxShadow={6}
          bgcolor={theme.palette.mode === "dark" ? colors.primary[500] : "#fff"}
        >
          {fields.map(({ label, id, type = "text", options }) => (
            <FormControl fullWidth margin="normal" key={id}>
              {label && <InputLabel htmlFor={id} shrink>{label}</InputLabel>}
              {type === "select" && options ? (
                <Select
                  native
                  id={id}
                  name={id}
                  value={edit[id] || ""}
                  onChange={(e) => handleChange(id, e.target.value)}
                  inputProps={{ id }}
                  fullWidth
                  displayEmpty
                >
                  <option value="">Select Gender</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  id={id}
                  name={id}
                  type={type}
                  value={edit[id] || ""}
                  onChange={(e) => handleChange(id, e.target.value)}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData("text");
                    if (
                      (["fname", "lname", "gender"].includes(id) && /[^A-Za-z\s]/.test(pasted)) ||
                      (["phone", "studclass", "rollNumber"].includes(id) && /[^\d]/.test(pasted)) ||
                      (id === "email" && /[^a-zA-Z0-9@._+-]/.test(pasted))
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              )}
              {errors[id] && (
                <Typography color="error" fontSize="12px" mt={0.5}>
                  {errors[id]}
                </Typography>
              )}
            </FormControl>
          ))}

          <FormControl fullWidth margin="normal">
            <InputLabel shrink htmlFor="image">Profile Image</InputLabel>
            <Input
              id="image"
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={handleImageChange}
            />
            {errors.image && (
              <Typography color="error" fontSize="12px" mt={0.5}>
                {errors.image}
              </Typography>
            )}
          </FormControl>

          {imagePreview && (
            <Box mt={2} textAlign="center">
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
              />
            </Box>
          )}

          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                padding: "10px 32px",
                fontWeight: "bold",
                fontSize: "16px",
                borderRadius: "12px",
                backgroundColor: colors.greenAccent[600],
                boxShadow: 3,
                "&:hover": {
                  backgroundColor: colors.greenAccent[500],
                },
              }}
              onClick={handleUpdate}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default EditStudentProfile;
