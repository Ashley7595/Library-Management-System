import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
import Header from "./Global/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function EditBooks() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { id } = useParams();

  const [imagePreview, setImagePreview] = useState(null);

  const [edit, setEdit] = useState({
    title: "",
    author: "",
    year: "",
    genre: "",
    language: "",
    image: null,
  });

  const [errors, setErrors] = useState({
    title: "",
    author: "",
    year: "",
    genre: "",
    language: "",
    image: "",
  });


  const validateField = (name, value) => {
    if (value === "" || value === null || (typeof value === "string" && value.trim() === "")) {
      return "This field is required";
    }

    if (name === "year") {
      const yearRegex = /^\d{4}$/;
      const currentYear = new Date().getFullYear();
      if (!yearRegex.test(value)) {
        return "Year must be a 4-digit number";
      }
      if (parseInt(value) < 1000 || parseInt(value) > currentYear) {
        return `Year must be between 1000 and ${currentYear}`;
      }
    }

    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (["title", "author", "genre", "language"].includes(name)) {
      updatedValue = updatedValue.replace(/[^A-Za-z\s]/g, '');
    }


    if (name === "year") {
      updatedValue = updatedValue.replace(/[^\d]/g, '').slice(0, 4);
    }

    const error = validateField(name, updatedValue);

    setEdit((prev) => ({ ...prev, [name]: updatedValue }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };


  const handleImageChange = (e) => {
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
    setEdit((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    let hasError = false;
    for (const key of ["title", "author", "year", "genre", "language"]) {
      const error = validateField(key, edit[key]);
      if (error) {
        newErrors[key] = error;
        hasError = true;
      }
    }

    if (edit.image instanceof File) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(edit.image.type)) {
        newErrors.image = "Only JPG/PNG images allowed";
        hasError = true;
      }
      if (edit.image.size > 2 * 1024 * 1024) {
        newErrors.image = "Image must be under 2MB";
        hasError = true;
      }
    }


    setErrors(newErrors);

    if (hasError) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const formData = new FormData();
    Object.keys(edit).forEach((key) => {
      if (key === "image" && !(edit.image instanceof File)) return;
      formData.append(key, edit[key]);
    });

    try {
      await axios.post(`http://localhost:5001/updateBook/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Book updated successfully");
      setTimeout(() => navigate('/Books'), 2000);
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update book");
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5001/singleBook/${id}`)
      .then((result) => {
        setEdit(result.data.data);
        if (result.data.data.image) {
          setImagePreview(`http://localhost:5001/book/${result.data.data.image}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const fields = [
    { label: "Title", id: "title" },
    { label: "Author", id: "author" },
    { label: "Year", id: "year" },
    { label: "Genre", id: "genre" },
    { label: "Language", id: "language" },
  ];

  return (
    <Box p={2}>
      <Box mb={4} textAlign="center">
        <Header title="Edit Book" />
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
          <form onSubmit={handleSubmit}>
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
                  value={edit[field.id] || ""}
                  onChange={handleInputChange}
                  type={field.id === "year" ? "number" : "text"}
                  inputProps={field.id === "year" ? { min: 1000, max: new Date().getFullYear() } : {}}
                />
                {errors[field.id] && <FormHelperText>{errors[field.id]}</FormHelperText>}
              </FormControl>
            ))}

            <FormControl fullWidth margin="normal" error={!!errors.image}>
              <InputLabel shrink htmlFor="image">
                Book Image
              </InputLabel>
              <Input
                id="image"
                type="file"
                inputProps={{ accept: "image/jpeg,image/png" }}
                onChange={handleImageChange}
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
              >
                Update
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default EditBooks;
