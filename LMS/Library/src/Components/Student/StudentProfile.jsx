import { Box, Button, useTheme, Typography } from '@mui/material';
import { tokens } from './Theme.js';
import { useNavigate } from "react-router-dom";
import Header from "./Global/Header";
import { useState, useEffect } from 'react';
import axios from 'axios';

function StudentProfile() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (!storedStudent) return;

    const student = JSON.parse(storedStudent);
    const studentId = student._id;

    axios.get(`http://localhost:5001/singleStudent/${studentId}`)
      .then((result) => {
        setProfile(result.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (!profile) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error">Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Header title="PROFILE" subtitle="Profile Information" />

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }} 
          gap={{ xs: 3, md: 6 }} 
          width="100%"
          maxWidth="800px"
          p={5}
          borderRadius="16px"
          boxShadow={6}
          bgcolor={theme.palette.mode === "dark" ? colors.primary[500] : "#fff"}
          sx={{
            textAlign: { xs: "center", sm: "center", md: "left", lg: "left" },
            gap: { xs: 3, sm: 3, md: 6 }, 
          }}
        >

          <Box
            flex="1.2"
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={{ xs: 3, md: 0 }} 
          >
            <img
              src={`http://localhost:5001/student/${profile.image}`}
              alt={profile?.fname}
              style={{
                width: "100%",
                height: "350px",
                maxWidth: "350px", 
                borderRadius: "16px",
                objectFit: "contain", 
                boxShadow: theme.palette.mode === "dark"
                  ? "0 0 15px #000"
                  : "0 0 20px rgba(0,0,0,0.1)"
              }}
            />
          </Box>

          <Box
            flex="2"
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              textAlign: { xs: "center", sm: "center", md: "left" }, 
            }}
          >
            {[ 
              { label: "Name", value: `${profile.fname} ${profile.lname}` },
              { label: "Email", value: profile.email },
              { label: "Phone", value: profile.phone },
              { label: "DOB", value: new Date(profile.dob).toLocaleDateString("en-GB") },
              { label: "Gender", value: profile.gender },
              { label: "Class", value: profile.studclass },
              { label: "Username", value: profile.username }
            ].map((item, i) => (
              <Typography 
                key={i} 
                variant="h6"
                fontWeight="600" 
                color={colors.grey[100]} 
                letterSpacing={1}
                sx={{ 
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                  whiteSpace: "nowrap",
                }}
              >
                <strong>{item.label}:</strong> {item.value}
              </Typography>
            ))}

            <Box mt={2}>
              <Button
                onClick={() => navigate('/EditStudentProfile/:id')}
                sx={{
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                  fontSize: { xs: "12px", sm: "14px" },  
                  fontWeight: "bold",
                  padding: { xs: "8px 20px", sm: "10px 25px" },
                  borderRadius: "10px",
                  boxShadow: 3,
                  "&:hover": {
                    backgroundColor: colors.blueAccent[600],
                  },
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default StudentProfile;