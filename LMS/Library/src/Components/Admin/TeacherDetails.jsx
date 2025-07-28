import { Box, Typography, useTheme, Avatar, Button, Stack } from "@mui/material";
import { tokens } from "./Theme";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function TeacherDetails() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/singleTeacher/${id}`)
      .then((result) => {
        setTeacher(result.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  if (!teacher) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error">
          Loading teacher details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      p={4}
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      bgcolor={theme.palette.background.default}
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={4}
        p={4}
        borderRadius="16px"
        boxShadow={6}
        bgcolor={theme.palette.mode === "dark" ? colors.primary[700] : "#fff"}
        maxWidth={900}
        width="100%"
      >
        <Avatar
          alt={`${teacher.fname} ${teacher.lname}`}
          src={`http://localhost:5001/teacher/${teacher.image}`}
          sx={{
            width: { xs: 200, md: 250 },
            height: { xs: 200, md: 250 },
            objectFit: "cover",
            mx: { xs: "auto", md: 0 },
          }}
        />

        <Box flex={1}>
          <Typography variant="h4" mb={3} color={colors.greenAccent[500]}>
            {teacher.fname} {teacher.lname}
          </Typography>

          <Stack spacing={1.5}>
            <Typography><strong>Email:</strong> {teacher.email}</Typography>
            <Typography><strong>Phone:</strong> {teacher.phone}</Typography>
            <Typography><strong>Subject:</strong> {teacher.subject}</Typography>
            <Typography><strong>Joining Date:</strong> {new Date(teacher.joinDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}</Typography>
            <Typography><strong>DOB:</strong> {new Date(teacher.dob).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}</Typography>
            <Typography><strong>Username:</strong> {teacher.username}</Typography>
          </Stack>

          <Button
            variant="contained"
            onClick={() => navigate("/ViewTeachers")}
            sx={{
              mt: 4,
              backgroundColor: colors.greenAccent[500],
              color: colors.grey[900],
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                backgroundColor: colors.greenAccent[600],
              },
            }}
          >
            ← Back to Teachers
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default TeacherDetails;
