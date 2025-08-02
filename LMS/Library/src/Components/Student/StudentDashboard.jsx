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
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import LocalLibraryIcon from "@mui/icons-material/LocalLibraryOutlined";
import StatBox from "./Global/StatBox";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

const API_URL = "http://localhost:5001";

function StudentDashboard() {
  const { searchQuery, setSearchQuery } = useOutletContext();
  const toastShownRef = useRef(false);
  const skipSearchEffect = useRef(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [historyPushed, setHistoryPushed] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const toastIdRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);


  const [studentName, setStudentName] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [bookStats, setBookStats] = useState({
    available: 0,
    borrowedByUser: 0,
    overdueByUser: 0,
  });

  const [currentTime, setCurrentTime] = useState(getFormattedTime());
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;
  const navigate = useNavigate();


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
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      const parsed = JSON.parse(storedStudent);
      setStudentName(`${parsed.fname} ${parsed.lname}`);
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

        const student = JSON.parse(localStorage.getItem("student"));
        const teacher = JSON.parse(localStorage.getItem("teacher"));
        const currentUser = student || teacher;
        const currentModel = student ? "Student" : "Teacher";

        const now = new Date();

        const updatedBooks = allBooks.map((book) => ({
          ...book,
          borrowedByCurrentUser:
            book.status &&
            book.borrowedBy?._id === currentUser?._id &&
            book.borrowedByModel === currentModel,
        }));

        const available = allBooks.filter((book) => !book.status).length;
        const borrowedByUser = allBooks.filter(
          (book) =>
            book.status &&
            book.borrowedBy?._id === currentUser?._id &&
            book.borrowedByModel === currentModel
        ).length;
        const overdueByUser = allBooks.filter(
          (book) =>
            book.status &&
            book.borrowedBy?._id === currentUser?._id &&
            book.borrowedByModel === currentModel &&
            new Date(book.dueDate) < now
        ).length;

        setBooks(updatedBooks);
        setFilteredBooks(updatedBooks);
        setBookStats({ available, borrowedByUser, overdueByUser });
      })
      .catch((err) => {
        console.error("Failed to fetch books", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (!historyPushed) {
      window.history.pushState({ page: 'student-dashboard' }, '', window.location.href);
      setHistoryPushed(true);
    }
  }, [historyPushed]);


  const handleBorrow = (bookId) => {
    const student = JSON.parse(localStorage.getItem("student"));
    if (!student || !student._id) return;

    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    setLoading(true);
    axios
      .post(`${API_URL}/createBorrowRecord`, {
        bookId,
        studentId: student._id,
        dueDate: dueDate.toISOString(),
      })
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
    const student = JSON.parse(localStorage.getItem("student"));
    if (!student || !student._id) return;

    const book = books.find((b) => b._id === bookId);
    if (!book || !book.status) return;
    if (
      book.borrowedBy?._id !== student._id ||
      book.borrowedByModel !== "Student"
    )
      return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/returnBook`, {
        bookId,
        studentId: student._id,
      });

      if (res.status === 200 && res.data.message === "Book returned successfully") {
        toast.success("Returned successfully!");
        fetchBooks();
      }
    } catch (err) {
      console.error("Failed to return book:", err);
      toast.error("Failed to return book");
    } finally {
      setLoading(false);
    }
  };

  const getBookImage = (imagePath) => `${API_URL}/book/${imagePath}`;

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);


  useEffect(() => {
    if (skipSearchEffect.current) {
      skipSearchEffect.current = false;
      return;
    }
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }

    const lowerQuery = searchQuery.toLowerCase().trim();

    if (!lowerQuery) {
      setFilteredBooks(books);
      setIsFiltered(false);
      toastShownRef.current = false;
      return;
    }

    skipSearchEffect.current = false;

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
      setIsFiltered(true);
      toastShownRef.current = false;
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    } else {
      if (!toastIdRef.current) {
        toastIdRef.current = toast.warn("No matching books found.", {
          position: "top-center",
          autoClose: 1500,
          pauseOnHover: true,
          onClose: () => { toastIdRef.current = null; }
        });
      }
      toastShownRef.current = true;
      setFilteredBooks(books);
      setIsFiltered(false);
    }


  }, [searchQuery, books]);

  useEffect(() => {
    return () => {
      setSearchQuery("");
    };
  }, []);


  useEffect(() => {
    const handlePopState = (event) => {
      if (searchQuery.trim() !== "") {
        skipSearchEffect.current = true;
        setSearchQuery('');
        setIsFiltered(false);
        window.history.pushState({ page: 'student-dashboard' }, '');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [searchQuery, setSearchQuery]);


  useEffect(() => {
    if (skipSearchEffect.current) {
      skipSearchEffect.current = false;
      return;
    }

    const lowerQuery = searchQuery.toLowerCase().trim();

    if (!lowerQuery) {
      setFilteredBooks(books);
      setIsFiltered(false);
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
      setIsFiltered(true);
      toastShownRef.current = false;
      window.history.pushState({ isSearch: true, query: searchQuery }, '');
    } else {
      if (!toastShownRef.current) {
        toast.warn("No matching books found.", {
          position: "top-center",
          autoClose: 1500,
          pauseOnHover: true,
        });
        toastShownRef.current = true;
      }
      setFilteredBooks(books);
      setIsFiltered(false);
    }
  }, [searchQuery, books]);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <Box p={2} mb={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header title="DASHBOARD" subtitle={`Welcome ${studentName}`} />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[600],
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
            gridTemplateColumns: "1fr",
          },
        }}
      >
        <Box
          gridColumn="span 4"
          p={2}
          borderRadius="12px"
          boxShadow={3}
          backgroundColor={
            theme.palette.mode === "dark" ? colors.primary[700] : colors.primary[400]
          }
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            "@media (max-width: 768px)": {
              boxShadow: "none",
            },
          }}
        >
          <StatBox
            title={bookStats.available.toString()}
            subtitle="Available Books"
            icon={<LibraryBooksOutlinedIcon />}
          />
        </Box>

        <Box
          gridColumn="span 4"
          p={2}
          borderRadius="12px"
          boxShadow={3}
          backgroundColor={
            theme.palette.mode === "dark" ? colors.primary[700] : colors.primary[400]
          }
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            "@media (max-width: 768px)": {
              boxShadow: "none",
            },
          }}
        >
          <StatBox
            title={bookStats.borrowedByUser.toString()}
            subtitle="Borrowed Books"
            icon={<MenuBookOutlinedIcon />}
          />
        </Box>

        <Box
          gridColumn="span 4"
          p={2}
          borderRadius="12px"
          boxShadow={3}
          backgroundColor={
            theme.palette.mode === "dark" ? colors.primary[700] : colors.primary[400]
          }
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            "@media (max-width: 768px)": {
              boxShadow: "none",
            },
          }}
        >
          <StatBox
            title={bookStats.overdueByUser.toString()}
            subtitle="Overdue Books"
            icon={<LocalLibraryIcon />}
          />
        </Box>
      </Box>


      <Box>
        <Typography variant="h3" fontWeight="bold" m={3}>
          Book List
        </Typography>
        <Grid container spacing={9} >
          {currentBooks.map((book) => {
            const student = JSON.parse(localStorage.getItem("student"));
            const isBorrowed = book.status === true;
            const isCurrentUser =
              isBorrowed &&
              book.borrowedBy?._id === student?._id &&
              book.borrowedByModel === "Student";

            return (
              <Grid
                item
                key={book._id}
                xs={12}
                sm={6}
                md={3}
                sx={{ display: "flex", justifyContent: "center" }}
              >
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
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color={colors.blueAccent[600]}
                      gutterBottom
                    >
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
                    <Box mt={2}>
                      {isBorrowed ? (
                        isCurrentUser ? (
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleReturn(book._id)}
                            disabled={loading}
                          >
                            {loading ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              "Return"
                            )}
                          </Button>
                        ) : (
                          <Button variant="contained" color="secondary" disabled>
                            Unavailable
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleBorrow(book._id)}
                          disabled={loading}
                        >
                          {loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            "Borrow"
                          )}
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            sx={{
              mx: 1,
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', 
              borderColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', 
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                borderColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              },
              '&.Mui-disabled': {
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
              }
            }}
            variant="outlined"
          >
            Prev
          </Button>

          <Typography variant="body1" sx={{
            mx: 2,
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000' 
          }}>
            Page {currentPage} of {totalPages}
          </Typography>

          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            sx={{
              mx: 1,
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', 
              borderColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000', 
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                borderColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              },
              '&.Mui-disabled': {
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
              }
            }}
            variant="outlined"
          >
            Next
          </Button>
        </Box>
        <ToastContainer position="top-center" autoClose={2000} />
      </Box>
    </Box>
  );
}

export default StudentDashboard;