import { useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Header from "./Global/Header";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  useTheme,
} from "@mui/material";
import { tokens } from "./Theme";
import { useNavigate } from "react-router-dom";

function AddBooks() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const fileInputRef = useRef();

  const [imagePreview, setImagePreview] = useState(null);

  const [users, setUsers] = useState({
    title: "",
    author: "",
    year: "",
    genre: "",
    language: "",
    image: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    author: "",
    year: "",
    genre: "",
    language: "",
    image: "",
  });

const handleInput = (e) => {
  const { name, value } = e.target;

  let filteredValue = value;

  if (["title", "author", "genre", "language"].includes(name)) {
    filteredValue = value.replace(/[^A-Za-z\s]/g, '');
    if (filteredValue.trim() === "") {
      setErrors((prev) => ({ ...prev, [name]: "This field is required" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  else if (name === "year") {
    filteredValue = value.replace(/[^\d]/g, '').slice(0, 4); 
    const currentYear = new Date().getFullYear();
    const yearInt = parseInt(filteredValue, 10);

    if (!/^\d{4}$/.test(filteredValue)) {
      setErrors((prev) => ({
        ...prev,
        year: "Year must be a 4-digit number",
      }));
    } else if (yearInt < 1000 || yearInt > currentYear) {
      setErrors((prev) => ({
        ...prev,
        year: `Year must be between 1000 and ${currentYear}`,
      }));
    } else {
      setErrors((prev) => ({ ...prev, year: "" }));
    }
  }

  setUsers((prev) => ({ ...prev, [name]: filteredValue }));
};


  const handleFile = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setErrors((prev) => ({ ...prev, image: "Book cover image is required" }));
      return;
    }

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Only JPG/PNG images allowed" }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 2MB" }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));

    setUsers((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = {};

    for (const [key, value] of Object.entries(users)) {
      if (
        value === "" ||
        (typeof value === "string" && value.trim() === "") ||
        value === null
      ) {
        newErrors[key] = "This field is required";
        hasError = true;
      }
    }

    const year = users.year;
    const yearRegex = /^\d{4}$/;
    const currentYear = new Date().getFullYear();

    if (!yearRegex.test(year) || parseInt(year) < 1000 || parseInt(year) > currentYear) {
      newErrors.year = `Year must be a valid 4-digit number between 1000 and ${currentYear}`;
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const formData = new FormData();
    Object.entries(users).forEach(([key, value]) => {
      formData.append(key, value);
    });

    axios
      .post("http://localhost:5001/addBook", formData)
      .then(() => {
        toast.success("Book Added Successfully");
        setTimeout(() => navigate('/Books'), 2000);
        setUsers({
          title: "",
          author: "",
          year: "",
          genre: "",
          language: "",
          image: "",
        });
        setErrors({});
        setImagePreview(null);
        fileInputRef.current.value = null;
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error in Adding Book");
      });
  };

  const fields = [
    { id: "title", label: "Title" },
    { id: "author", label: "Author" },
    { id: "year", label: "Year" },
    { id: "genre", label: "Genre" },
    { id: "language", label: "Language" },
  ];

  return (
    <Box p={2}>
      <Box mb={4} textAlign="center">
        <Header title="Add Books" subtitle="Enter New Book Details Below" />
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Box
          width="100%"
          maxWidth="500px"
          p={4}
          borderRadius="16px"
          boxShadow={6}
          bgcolor={theme.palette.mode === "dark" ? colors.primary[500] : "#fff"}
        >
          {fields.map((field) => (
            <FormControl
              fullWidth
              margin="normal"
              key={field.id}
              error={!!errors[field.id]}
            >
              <InputLabel htmlFor={field.id}>{field.label}</InputLabel>
              <Input
                id={field.id}
                name={field.id}
                value={users[field.id]}
                onChange={handleInput}
                type={field.id === "year" ? "number" : "text"}
                inputProps={field.id === "year" ? { min: 1000, max: new Date().getFullYear() } : {}}
              />
              {errors[field.id] && (
                <FormHelperText>{errors[field.id]}</FormHelperText>
              )}
            </FormControl>
          ))}

          <FormControl fullWidth margin="normal" error={!!errors.image}>
            <InputLabel shrink htmlFor="image">
              Book Cover Image
            </InputLabel>
            <Input
              id="image"
              type="file"
              inputProps={{ accept: "image/jpeg,image/png" }}
              onChange={handleFile}
              ref={fileInputRef}
            />
            {errors.image && <FormHelperText>{errors.image}</FormHelperText>}
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
              onClick={handleSubmit}
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
            >
              Add Book
            </Button>
          </Box>
        </Box>
      </Box>

      <ToastContainer />
    </Box>
  );
}

export default AddBooks;