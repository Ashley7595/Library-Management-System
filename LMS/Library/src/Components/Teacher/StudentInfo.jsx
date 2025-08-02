import {
  Box,
  Typography,
  useTheme,
  Avatar,
  Button,
  Stack,
} from "@mui/material";
import { tokens } from "./Theme";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function StudentInfo() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  const from = location.state?.from || "/StudentsList";

  useEffect(() => {
    axios
      .get(`http://localhost:5001/singleStudent/${id}`)
      .then((result) => {
        setStudent(result.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  if (!student) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error">
          Loading student details...
        </Typography>
      </Box>
    );
  }

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(from);
    }
  };

  return (
    <Box
      p={{ xs: 2, sm: 4 }}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      bgcolor={theme.palette.background.default}
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "column", md: "row" }}
        justifyContent="center"  
        alignItems="center"      
        gap={4}
        p={{ xs: 2, sm: 4 }} 
        borderRadius="16px"
        boxShadow={6}
        bgcolor={theme.palette.mode === "dark" ? colors.primary[700] : "#fff"}
        maxWidth="100%"
        width={{ xs: "100%", sm: 800, md: 900 }}
        textAlign={{ xs: "center", sm: "center", md: "left" }}  
        mx="auto"  
      >
        <Avatar
          alt={`${student.fname} ${student.lname}`}
          src={`http://localhost:5001/student/${student.image}`}
          sx={{
            width: { xs: 180, sm: 200, md: 250 },
            height: { xs: 180, sm: 200, md: 250 },
            objectFit: "cover",
            mx: "auto",  
          }}
        />

        <Box flex={1}>
          <Typography
            variant="h4"
            mb={3}
            color={colors.greenAccent[500]}
            fontSize={{ xs: "1.8rem", sm: "2.2rem", md: "2.5rem" }}
            textAlign={{ xs: "center", sm: "center", md: "left" }}  
          >
            {student.fname} {student.lname}
          </Typography>

          <Stack spacing={1.5}>
            <Typography>
              <strong>DOB:</strong>{" "}
              {new Date(student.dob).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Typography>
            <Typography>
              <strong>Gender:</strong> {student.gender}
            </Typography>
            <Typography>
              <strong>Email:</strong> {student.email}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {student.phone}
            </Typography>
            <Typography>
              <strong>Class:</strong> {student.studclass}
            </Typography>
            <Typography>
              <strong>Roll Number:</strong> {student.rollNumber}
            </Typography>
            <Typography>
              <strong>Username:</strong> {student.username}
            </Typography>
            <Typography>
              <strong>Joining Date:</strong>{" "}
              {new Date(student.joinDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Typography>
          </Stack>

          <Button
            variant="contained"
            onClick={handleBack}
            sx={{
              mt: 4,
              backgroundColor: colors.greenAccent[500],
              color: colors.grey[900],
              fontWeight: "bold",
              textTransform: "none",
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                backgroundColor: colors.greenAccent[600],
              },
            }}
          >
            ← Back to Students
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default StudentInfo;
