import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "./Theme";
import { useState, useEffect } from 'react';
import Header from "./Global/Header";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Face6OutlinedIcon from '@mui/icons-material/Face6Outlined';
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import BarChart from "./Global/BarChart";
import StatBox from "./Global/StatBox";
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useOutletContext } from "react-router-dom";

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [currentTime, setCurrentTime] = useState(getFormattedTime());
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  const [genreData, setGenreData] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  function getFormattedTime() {
    return new Date().toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour12: true
    });
  }

  useEffect(() => {
    axios.get("http://localhost:5001/viewAllTeachers")
      .then((res) => {
        if (res.data?.data) setTeacherCount(res.data.data.length);
      })
      .catch((err) => console.error("Failed to fetch teachers:", err));

    axios.get("http://localhost:5001/viewAllStudents")
      .then((res) => {
        if (res.data?.data) setStudentCount(res.data.data.length);
      })
      .catch((err) => console.error("Failed to fetch students:", err));

    axios.get("http://localhost:5001/viewAllBooks")
      .then((res) => {
        if (res.data?.data) {
          const books = res.data.data;
          setBookCount(books.length);

          const genreCounts = books.reduce((acc, book) => {
            const genre = book.genre || "Unknown";
            acc[genre] = (acc[genre] || 0) + 1;
            return acc;
          }, {});

          const genreChartData = Object.entries(genreCounts).map(([genre, count]) => ({
            genre,
            count,
          }));

          setGenreData(genreChartData);
        }
      })
      .catch((err) => console.error("Failed to fetch books:", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getFormattedTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5001/viewAllComplaints")
      .then((res) => {
        setComplaints(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch complaints:", err);
      });
  }, []);

   const handleDelete = (id) => {
  if (!window.confirm("Are you sure you want to resolve this complaint?")) return;

  axios
    .post("http://localhost:5001/deleteComplaint",{id})
    .then(() => {
      const updated = complaints.filter((complaint) => complaint._id !== id);
      setComplaints(updated);
      toast.success("Complaint resolved successfully");
    })
    .catch((error) => {
      console.error("Error resolving this complaint:", error);
      toast.error("Error resolving this complaint");
    });
};



  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome Admin" />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          {currentTime}
        </Button>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
        mb={4}
        sx={{
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr',
            gridAutoRows: 'auto',
          },
        }}
      >
        {/* Stat Boxes */}
        {[{
          title: teacherCount.toString(),
          subtitle: "Total Teachers",
          icon: <PersonOutlineOutlinedIcon sx={{ color: colors.greenAccent[600], fontSize: "40px" }} />,
        },
        {
          title: studentCount.toString(),
          subtitle: "Total Students",
          icon: <Face6OutlinedIcon sx={{ color: colors.greenAccent[600], fontSize: "40px" }} />,
        },
        {
          title: bookCount.toString(),
          subtitle: "Total Books",
          icon: <LibraryBooksOutlinedIcon sx={{ color: colors.greenAccent[600], fontSize: "40px" }} />,
        }
        ].map((stat, index) => (
          <Box
            key={index}
            gridColumn="span 4"
            p={2}
            borderRadius="12px"
            boxShadow={3}
            bgcolor={theme.palette.mode === "dark" ? colors.primary[700] : colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              '@media (max-width: 768px)': {
                gridColumn: 'span 12',
                marginBottom: '10px',
              },
            }}
          >
            <StatBox
              title={stat.title}
              subtitle={stat.subtitle}
              icon={stat.icon}
            />
          </Box>
        ))}

        {/* Bar Chart */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          bgcolor={theme.palette.mode === "dark" ? colors.primary[900] : colors.primary[400]}
          borderRadius="8px"
          sx={{
            '@media (max-width: 768px)': {
              gridColumn: 'span 12',
              gridRow: 'span 1',
              marginBottom: '10px',
            },
          }}
          mt={3}
        >
          <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                Number of Books by Genre
              </Typography>
              <Typography variant="h3" fontWeight="500" color={colors.greenAccent[500]}>
                Total: {bookCount}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              height: "300px",
              maxHeight: "400px",
              px: "10px",
              pb: "10px",
              '@media (max-width: 768px)': {
                height: "250px",
                paddingLeft: "10px",
                paddingRight: "10px",
              },
            }}
          >
            <BarChart data={genreData} />
          </Box>
        </Box>

        {/* Complaints Box */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          p={2}
          mt={3}
          borderRadius="12px"
          boxShadow={3}
          bgcolor={theme.palette.mode === "dark" ? colors.primary[700] : "#ffffff"}
          display="flex"
          flexDirection="column"
          overflow="hidden"
          sx={{
            '@media (max-width: 768px)': {
              gridColumn: 'span 12',
              gridRow: 'span 1',
            },
          }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            color={theme.palette.mode === "dark" ? colors.blueAccent[500] : "#2e7d32"}
            mb={1}
          >
            Recent Complaints
          </Typography>

          <Box
            sx={{
              overflowY: "auto",
              maxHeight: "230px",
              pr: 1,
              scrollbarWidth: "thin",
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.mode === "dark" ? colors.blueAccent[500] : "#c0c0c0",
                borderRadius: "3px",
              },
            }}
          >
            {complaints.length === 0 ? (
              <Typography variant="body2" color={theme.palette.mode === "dark" ? colors.grey[400] : colors.grey[600]}>
                No complaints available.
              </Typography>
            ) : (
              complaints.map((complaint, i) => (
                <Box
                  key={i}
                  mb={2}
                  p={1.5}
                  borderRadius="8px"
                  bgcolor={theme.palette.mode === "dark" ? colors.primary[600] : "#f9f9f9"}
                  boxShadow={theme.palette.mode === "light" ? 1 : "none"}
                >
                  <Box display="flex" mb={0.5}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ minWidth: "80px" }}>Name:</Typography>
                    <Typography variant="body2">{complaint.fname} {complaint.lname}</Typography>
                  </Box>
                  <Box display="flex" mb={0.5}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ minWidth: "80px" }}>Email:</Typography>
                    <Typography variant="body2">{complaint.email}</Typography>
                  </Box>
                  <Box display="flex" mb={0.5}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ minWidth: "80px" }}>Subject:</Typography>
                    <Typography variant="body2">{complaint.subject}</Typography>
                  </Box>
                  <Box display="flex">
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ minWidth: "80px" }}>Message:</Typography>
                    <Typography variant="body2">{complaint.inquiry}</Typography>
                  </Box>

                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/ViewComplaint/${complaint._id}`)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={() => handleDelete(complaint._id)}
                    >
                     Resolve
                    </Button>
                  </Box>
                </Box>

              ))
            )}
          </Box>
             <ToastContainer position="top-center" autoClose={2000} />
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
