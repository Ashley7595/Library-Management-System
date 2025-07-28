import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  useTheme,
  Typography,
} from "@mui/material";
import { tokens } from "./Theme";
import Header from "./Global/Header";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'

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

    axios.get(`http://localhost:5001/singleStudent/${studentId}`)
      .then((result) => {
        const studentData = result.data.data;
        const formattedDob = studentData.dob ? studentData.dob.split("T")[0] : "";
        setEdit({
          ...studentData,
          dob: formattedDob,
        });
        setImagePreview(`http://localhost:5001/student/${studentData.image}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const validate = () => {
    const errs = {};
    const digitsOnly = edit.phone.replace(/[^\d]/g, "");
    const dobDate = new Date(edit.dob);
    const today = new Date();
    const currentYear = today.getFullYear();
    const age = currentYear - dobDate.getFullYear();
    const hasHadBirthday =
      today.getMonth() > dobDate.getMonth() ||
      (today.getMonth() === dobDate.getMonth() &&
        today.getDate() >= dobDate.getDate());
    const actualAge = hasHadBirthday ? age : age - 1;

    if (!edit.fname.trim()) errs.fname = "First name is required";
    if (!edit.lname.trim()) errs.lname = "Last name is required";
    if (!edit.gender) errs.gender = "Gender is required";
    if (!edit.username.trim()) errs.username = "Username is required";

 
    if (!/^\S+@\S+\.\S+$/.test(edit.email)) {
      errs.email = "Invalid email";
    }

    if (!/^\d{10}$/.test(digitsOnly)) {
      errs.phone = "Phone must contain exactly 10 digits";
    }

    if (!edit.dob) {
      errs.dob = "Date of birth is required";
    } else if (actualAge < 5 || actualAge > 18) {
      errs.dob = "Age must be between 5 and 18 years";
    }

    const classNum = parseInt(edit.studclass);
    if (isNaN(classNum) || classNum < 1 || classNum > 12) {
      errs.studclass = "Class must be between 1 and 12";
    }

    const roll = parseInt(edit.rollNumber);
    if (isNaN(roll) || roll < 1 || roll > 1000) {
      errs.rollNumber = "Roll Number must be 1–1000";
    }

    if (edit.image instanceof File) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(edit.image.type)) {
        errs.image = "Only JPG/PNG allowed";
      }
      if (edit.image.size > 2 * 1024 * 1024) {
        errs.image = "Image must be under 2MB";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

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
        setTimeout(() => navigate('/StudentProfile'), 1500);
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed To Update Profile");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEdit({ ...edit, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (id, value) => {
    setEdit((prev) => ({ ...prev, [id]: value }));
  };

  const fields = [
    { label: "First Name", id: "fname" },
    { label: "Last Name", id: "lname" },
    { label: "Email", id: "email" },
    { label: "Phone Number", id: "phone" },
    { label: "DOB", id: "dob", type: "date" },
    { label: "Gender", id: "gender" },
    { label: "Class", id: "studclass" },
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
          {fields.map(({ label, id, type = "text" }) => (
            <FormControl fullWidth margin="normal" key={id}>
              <InputLabel htmlFor={id}>{label}</InputLabel>
              <Input
                id={id}
                name={id}
                type={type}
                value={edit[id] || ""}
                onChange={(e) => handleChange(id, e.target.value)}
              />
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