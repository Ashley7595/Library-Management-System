import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  Typography,
  useTheme,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { tokens } from './Theme';
import Header from "./Global/Header";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditTeacherProfile() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [edit, setEdit] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    dob: '',
    subject: '',
    joinDate: '',
    username: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacher");
    if (!storedTeacher) return;

    const teacher = JSON.parse(storedTeacher);
    const teacherId = teacher._id;

    axios.get(`http://localhost:5001/singleTeacher/${teacherId}`)
      .then((res) => {
        const data = res.data.data;
        setEdit({
          ...data,
          dob: data.dob ? data.dob.split('T')[0] : '',
        });
        setImagePreview(`http://localhost:5001/teacher/${data.image}`);
      })
      .catch(console.error);
  }, []);

  const validateFields = () => {
    let ok = true;
    const newErrors = {};

    if (!edit.fname.trim()) {
      newErrors.fname = 'First name is required.';
      ok = false;
    }

    if (!edit.lname.trim()) {
      newErrors.lname = 'Last name is required.';
      ok = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!edit.email.trim()) {
      newErrors.email = 'Email is required.';
      ok = false;
    } else if (!emailRegex.test(edit.email)) {
      newErrors.email = 'Enter a valid email address.';
      ok = false;
    }


    const digits = edit.phone.replace(/[^\d]/g, '');
    if (!/^\d{10}$/.test(digits)) {
      newErrors.phone = 'Phone number must be exactly 10 digits.';
      ok = false;
    }

    if (!edit.dob) {
      newErrors.dob = 'Date of birth is required.';
      ok = false;
    } else {
      const d = new Date(edit.dob);
      const y = d.getFullYear();
      const today = new Date();
      let age = today.getFullYear() - y;
      const hadBirthday =
        today.getMonth() > d.getMonth() ||
        (today.getMonth() === d.getMonth() && today.getDate() >= d.getDate());
      age = hadBirthday ? age : age - 1;

      if (y < 1980 || y > 2025) {
        newErrors.dob = 'Year must be between 1980 and 2025';
        ok = false;
      } else if (age < 21) {
        newErrors.dob = 'Minimum age is 21 years';
        ok = false;
      }
    }

    setErrors(newErrors);
    return ok;
  };

  const handleUpdate = async () => {
    const isValid = validateFields();
    setTouched({
      fname: true,
      lname: true,
      email: true,
      phone: true,
      dob: true,
    });

    if (!isValid) {
      toast.error('Please fix the form errors');
      return;
    }

    const teacher = JSON.parse(localStorage.getItem('teacher'));
    const formData = new FormData();
    Object.entries(edit).forEach(([k, v]) => {
      if (k === 'image' && !(v instanceof File)) return;
      formData.append(k, v);
    });

    try {
      const res = await axios.post(
        `http://localhost:5001/updateTeacher/${teacher._id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      toast.success('Profile updated successfully');
      localStorage.setItem('teacher', JSON.stringify(res.data.data));
      setTimeout(() => navigate('/TeacherProfile'), 1500);
    } catch (e) {
      console.error(e);
      toast.error('Failed to update profile');
    }
  };

 const handleChange = (id, value) => {
  let filteredValue = value;

  if (id === 'fname' || id === 'lname') {
    filteredValue = value.replace(/[^A-Za-z]/g, '');
  }

  if (id === 'phone') {
    filteredValue = value.replace(/[^\d]/g, '');
  }

  setEdit((prev) => ({ ...prev, [id]: filteredValue }));
  setTouched((prev) => ({ ...prev, [id]: true }));

  const newErrors = { ...errors };

  switch (id) {
    case 'fname':
      newErrors.fname = filteredValue.trim() ? '' : 'First name is required.';
      break;

    case 'lname':
      newErrors.lname = filteredValue.trim() ? '' : 'Last name is required.';
      break;

    case 'email':
      if (!filteredValue.trim()) {
        newErrors.email = 'Email is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(filteredValue)) {
        newErrors.email = 'Enter a valid email address.';
      } else {
        newErrors.email = '';
      }
      break;

    case 'phone':
      newErrors.phone = /^\d{10}$/.test(filteredValue)
        ? ''
        : 'Phone number must be exactly 10 digits.';
      break;

    case 'dob':
      if (!filteredValue) {
        newErrors.dob = 'Date of birth is required.';
      } else {
        const d = new Date(filteredValue);
        const y = d.getFullYear();
        const today = new Date();
        let age = today.getFullYear() - y;
        const hadBirthday =
          today.getMonth() > d.getMonth() ||
          (today.getMonth() === d.getMonth() && today.getDate() >= d.getDate());
        age = hadBirthday ? age : age - 1;

        if (y < 1980 || y > 2025) {
          newErrors.dob = 'Year must be between 1980 and 2025';
        } else if (age < 21) {
          newErrors.dob = 'Minimum age is 21 years';
        } else {
          newErrors.dob = '';
        }
      }
      break;

    default:
      break;
  }

  setErrors(newErrors);
};


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEdit({ ...edit, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <ToastContainer />
      <Box p={2}>
        <Box mb={4} textAlign="center">
          <Header title="Edit Profile" />
        </Box>
        <Box display="flex" justifyContent="center">
          <Box
            width="100%"
            maxWidth="500px"
            p={4}
            borderRadius="16px"
            boxShadow={6}
            bgcolor={theme.palette.mode === 'dark' ? colors.primary[500] : '#fff'}
          >
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="fname">First Name</InputLabel>
              <Input
                id="fname"
                value={edit.fname}
                onChange={(e) => handleChange('fname', e.target.value)}
              />
              {touched.fname && errors.fname && (
                <Typography color="error" fontSize="12px">{errors.fname}</Typography>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="lname">Last Name</InputLabel>
              <Input
                id="lname"
                value={edit.lname}
                onChange={(e) => handleChange('lname', e.target.value)}
              />
              {touched.lname && errors.lname && (
                <Typography color="error" fontSize="12px">{errors.lname}</Typography>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                id="email"
                value={edit.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              {touched.email && errors.email && (
                <Typography color="error" fontSize="12px">{errors.email}</Typography>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="phone">Phone Number</InputLabel>
              <Input
                id="phone"
                value={edit.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
              {touched.phone && errors.phone && (
                <Typography color="error" fontSize="12px">{errors.phone}</Typography>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input
                id="username"
                value={edit.username}
                onChange={(e) => handleChange('username', e.target.value)}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="dob">DOB</InputLabel>
              <Input
                id="dob"
                type="date"
                value={edit.dob || ''}
                onChange={(e) => handleChange('dob', e.target.value)}
              />
              {touched.dob && errors.dob && (
                <Typography color="error" fontSize="12px">{errors.dob}</Typography>
              )}
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel shrink htmlFor="image">Profile Image</InputLabel>
              <Input
                id="image"
                type="file"
                inputProps={{ accept: 'image/*' }}
                onChange={handleImageChange}
              />
            </FormControl>

            {imagePreview && (
              <Box mt={2} textAlign="center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                />
              </Box>
            )}

            <Box display="flex" justifyContent="center" mt={4}>
              <Button
                variant="contained"
                size="large"
                onClick={handleUpdate}
                sx={{
                  padding: '10px 32px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  borderRadius: '12px',
                  backgroundColor: colors.greenAccent[600],
                  '&:hover': { backgroundColor: colors.greenAccent[500] },
                }}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default EditTeacherProfile;
