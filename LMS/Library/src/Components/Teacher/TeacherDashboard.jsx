import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { tokens } from "./Theme";
import { useState, useEffect, useRef } from "react";
import Header from "./Global/Header";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import Face6OutlinedIcon from "@mui/icons-material/Face6Outlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import StatBox from "./Global/StatBox";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

const API_URL = "http://localhost:5001";

function TeacherDashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [teacherName, setTeacherName] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [bookStats, setBookStats] = useState({
    available: 0,
    borrowed: 0,
    students: 0,
  });
  const toastShownRef = useRef(false);
  const [currentTime, setCurrentTime] = useState(getFormattedTime());
  const [loading, setLoading] = useState(false);
  const { searchQuery, setSearchQuery } = useOutletContext();

  function getFormattedTime() {
    return new Date().toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour12: true,
    });
  }

  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacher");
    if (storedTeacher) {
      const parsed = JSON.parse(storedTeacher);
      setTeacherName(parsed.fname + " " + parsed.lname);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getFormattedTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchBooks = () => {
    setLoading(true);
    axios
      .get(`${API_URL}/viewAllBooks`)
      .then((res) => {
        const allBooks = res.data.data;

        const teacher = JSON.parse(localStorage.getItem("teacher"));
        const student = JSON.parse(localStorage.getItem("student"));
        const currentUser = teacher || student;
        const currentModel = teacher ? "Teacher" : "Student";

        const updatedBooks = allBooks.map((book) => ({
          ...book,
          borrowedByCurrentUser:
            book.borrowedBy &&
            book.borrowedBy._id === currentUser?._id &&
            book.borrowedByModel === currentModel,
        }));

        setBooks(updatedBooks);
        setFilteredBooks(updatedBooks);

        const borrowedCount = allBooks.filter(
          (book) =>
            book.status === true &&
            book.borrowedBy &&
            book.borrowedBy._id === currentUser?._id &&
            book.borrowedByModel === currentModel
        ).length;

        const availableCount = allBooks.filter((book) => !book.status).length;

        setBookStats((prev) => ({
          ...prev,
          borrowed: borrowedCount,
          available: availableCount,
        }));
      })
      .catch((err) => {
        console.error("Failed to fetch books", err);
      })
      .finally(() => setLoading(false));
  };

  const fetchStudentsByTeacher = async () => {
    const teacher = JSON.parse(localStorage.getItem("teacher"));
    if (!teacher?._id) return;

    try {
      const res = await axios.post(`${API_URL}/viewStudentsByTeacher`, {
        teacherId: teacher._id,
      });

      const students = res.data.data || [];

      setBookStats((prev) => ({
        ...prev,
        students: students.length,
      }));
    } catch (error) {
      console.error("Failed to fetch students", error);
      toast.error("Error loading students");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchStudentsByTeacher();
  }, []);


  const skipSearchEffect = useRef(false);

useEffect(() => {
  if (skipSearchEffect.current) {
    skipSearchEffect.current = false;
    return;
  }

  const lowerQuery = searchQuery.toLowerCase().trim();

  if (!lowerQuery) {
    setFilteredBooks(books);
    toastShownRef.current = false;
    return;
  }

  const filtered = books.filter((book) => {
    let statusText = "available";
    if (book.status) {
      if (book.dueDate && new Date(book.dueDate) < new Date()) {
        statusText = "overdue";
      } else {
        statusText = "borrowed";
      }
    }

    return (
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      book.genre.toLowerCase().includes(lowerQuery) ||
      (book.year && book.year.toString().includes(lowerQuery)) ||
      statusText.includes(lowerQuery)
    );
  });

  if (filtered.length > 0) {
    setFilteredBooks(filtered);
    toastShownRef.current = false;

    setTimeout(() => {
      skipSearchEffect.current = true;
      setSearchQuery(""); 
    }, 300);
  } else {
    if (!toastShownRef.current) {
      toast.warn("No matching books found.", {
        position: "top-center",
        autoClose: 3000,
        pauseOnHover: true,
      });
      toastShownRef.current = true;

      setTimeout(() => {
        skipSearchEffect.current = true;
        setSearchQuery("");
      }, 1000);
    }
  }
}, [searchQuery, books]);


  useEffect(() => {
    return () => {
      setSearchQuery("");
    };
  }, []);

  const handleBorrow = (bookId) => {
    const teacher = JSON.parse(localStorage.getItem("teacher"));
    const student = JSON.parse(localStorage.getItem("student"));
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    if (!teacher && !student) {
      return toast.error("User not logged in");
    }

    const payload = {
      bookId,
      dueDate: dueDate.toISOString(),
    };

    if (teacher?._id) {
      payload.teacherId = teacher._id;
    } else if (student?._id) {
      payload.studentId = student._id;
    }

    setLoading(true);

    axios
      .post(`${API_URL}/createBorrowRecord`, payload)
      .then(() => {
        toast.success("Book borrowed successfully!");
        fetchBooks();
      })
      .catch((err) => {
        console.error("Borrow error", err.response?.data || err);
        toast.error(err?.response?.data?.message || "Failed to borrow");
      })
      .finally(() => setLoading(false));
  };

  const handleReturn = async (bookId) => {
    const teacher = JSON.parse(localStorage.getItem("teacher"));
    const student = JSON.parse(localStorage.getItem("student"));

    if (!teacher && !student) {
      toast.error("User not logged in");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/returnBook`, {
        bookId,
        teacherId: teacher?._id,
        studentId: student?._id,
      });

      if (res.data.message === "Book returned successfully") {
        toast.success("Book returned successfully!");
        fetchBooks();
      } else {
        toast.error("Failed to return book");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error returning book");
    } finally {
      setLoading(false);
    }
  };

  const getBookImage = (imagePath) => `${API_URL}/book/${imagePath}`;

  return (
    <Box p={2} mb={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header title="DASHBOARD" subtitle={`Welcome ${teacherName}`} />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
            "@media (max-width: 700px)": {
              fontSize: "12px",
              padding: "8px 16px",
              width: "100%",
            },
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
          "@media (max-width: 700px)": {
            gridTemplateColumns: "1fr 1fr",
          },
        }}
      >
        <Box gridColumn="span 4" p={2} borderRadius="12px" boxShadow={3} backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox title={bookStats.available?.toString() ?? "0"} subtitle="Available Books" icon={<LibraryBooksOutlinedIcon />} />
        </Box>

        <Box gridColumn="span 4" p={2} borderRadius="12px" boxShadow={3} backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox title={bookStats.borrowed.toString()} subtitle="Borrowed Books" icon={<MenuBookOutlinedIcon />} />
        </Box>

        <Box gridColumn="span 4" p={2} borderRadius="12px" boxShadow={3} backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox title={bookStats.students.toString()} subtitle="Total Students" icon={<Face6OutlinedIcon />} />
        </Box>
      </Box>


      <Grid container spacing={9}>
        {filteredBooks.map((book) => {
          const isBorrowed = book.status === true;
          const teacher = JSON.parse(localStorage.getItem("teacher"));
          const student = JSON.parse(localStorage.getItem("student"));
          const currentUser = teacher || student;
          const currentModel = teacher ? "Teacher" : "Student";

          const isCurrentUser =
            isBorrowed &&
            book.borrowedBy?._id === currentUser?._id &&
            book.borrowedByModel === currentModel;

          return (
            <Grid item key={book._id} xs={12} sm={6} md={3} sx={{ display: "flex", justifyContent: "center" }}>
              <Card
                sx={{
                  borderRadius: "16px",
                  boxShadow: 5,
                  width: "250px",
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      width: "100%",
                      height: "150px",
                      backgroundImage: `url(${getBookImage(book.image)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "8px",
                      marginBottom: "16px",
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold" color={colors.blueAccent[600]} gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Author:</strong> {book.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Year:</strong> {book.year}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Genre:</strong> {book.genre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Status:</strong> {book.status ? "Borrowed" : "Available"}
                  </Typography>
                </CardContent>

                <Box m={2}>
                  {!isBorrowed ? (
                    <Button variant="contained" color="success" onClick={() => handleBorrow(book._id)}>
                      Borrow
                    </Button>
                  ) : isCurrentUser ? (
                    <Button variant="contained" color="error" onClick={() => handleReturn(book._id)}>
                      Return
                    </Button>
                  ) : (
                    <Button variant="contained" disabled>
                      Unavailable
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <ToastContainer position="top-center" autoClose={2000} />

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}

export default TeacherDashboard;
