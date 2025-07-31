import { Box, Typography, useTheme, Avatar, Button, Stack } from "@mui/material";
import { tokens } from "./Theme";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function ViewComplaint() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/singleComplaint/${id}`)
      .then((result) => {
        setComplaint(result.data.data); 
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  if (!complaint) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error">
          Loading complaint details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      mt={5}
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
        {
  complaint.image &&
  (/\.(jpg|jpeg|png|gif)$/i.test(complaint.image) ? (
    <Avatar
      alt={`${complaint.fname} ${complaint.lname}`}
      src={`http://localhost:5001/contact/${complaint.image}`}
      sx={{
        width: { xs: 200, md: 250 },
        height: { xs: 200, md: 250 },
        objectFit: "cover",
        mx: { xs: "auto", md: 0 },
      }}
    />
  ) : (
    <Box
      sx={{
        width: { xs: 200, md: 250 },
        height: { xs: 200, md: 250 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        borderRadius: "8px",
        mx: { xs: "auto", md: 0 },
        textAlign: "center",
        p: 2,
      }}
    >
      <a
        href={`http://localhost:5001/contact/${complaint.image}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#333", fontWeight: "bold", textDecoration: "underline" }}
      >
        Open Uploaded File
      </a>
    </Box>
  ))
}


        <Box flex={1}>
          <Typography variant="h4" mb={3} color={colors.greenAccent[500]}>
            {complaint.fname} {complaint.lname}
          </Typography>

          <Stack spacing={1.5}>
            <Typography><strong>Email:</strong> {complaint.email}</Typography>
            <Typography><strong>Phone:</strong> {complaint.phone}</Typography>
            <Typography><strong>Subject:</strong> {complaint.subject}</Typography>
            <Typography><strong>Message:</strong> {complaint.inquiry}</Typography>
            <Typography><strong>Contact Method:</strong> {complaint.contactMethod}</Typography>
          </Stack>

          <Button
            variant="contained"
            onClick={() => navigate("/Dashboard")}
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
            ← Back to Dashboard
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ViewComplaint;
