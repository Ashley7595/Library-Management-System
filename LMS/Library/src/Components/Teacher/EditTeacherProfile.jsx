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
  const [errors, setErrors] = useState({ phone: '', dob: '' });

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
    const newErrors = { phone: '', dob: '' };

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
    if (!validateFields()) {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEdit({ ...edit, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const fields = [
    { label: 'First Name', id: 'fname' },
    { label: 'Last Name', id: 'lname' },
    { label: 'Email', id: 'email' },
    { label: 'Phone Number', id: 'phone' },
    { label: 'Username', id: 'username' },
  ];

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
            {fields.map(({ label, id, type = 'text' }) => (
              <FormControl fullWidth margin="normal" key={id}>
                <InputLabel htmlFor={id}>{label}</InputLabel>
                <Input
                  id={id}
                  name={id}
                  type={type}
                  value={edit[id] || ''}
                  onChange={e => setEdit({ ...edit, [id]: e.target.value })}
                />
                {id === 'phone' && errors.phone && (
                  <Typography color="error" fontSize="12px">{errors.phone}</Typography>
                )}
              </FormControl>
            ))}

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="dob">DOB</InputLabel>
              <Input
                id="dob"
                type="date"
                value={edit.dob || ''}
                onChange={e => setEdit({ ...edit, dob: e.target.value })}
              />
              {errors.dob && (
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