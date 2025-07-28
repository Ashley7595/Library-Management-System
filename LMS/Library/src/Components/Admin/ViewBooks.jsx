import { Box, Typography, useTheme, Card, CardContent, CardActions, Button, Grid } from "@mui/material";
import { tokens } from './Theme.js';
import Header from "./Global/Header";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function ViewBooks() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const { searchQuery } = useOutletContext();  
  const toastShownRef = useRef(false);

  useEffect(() => {
    axios.get("http://localhost:5001/viewAllBooks")
      .then((result) => {
        const booksWithFullImageUrl = result.data.data.map(book => ({
          ...book,
          image: `http://localhost:5001/book/${book.image}`
        }));
        setBooks(booksWithFullImageUrl);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.post("http://localhost:5001/deleteBook", { id })
      .then(() => {
        const filtered = books.filter((book) => book._id !== id);
        setBooks(filtered);
      })
      .catch((error) => {
        console.log(error);
      });
  };


  let tempFilteredBooks = books.filter((book) => {
    if (!searchQuery || searchQuery.trim() === "") return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      book.title?.toLowerCase().includes(lowerQuery) ||
      book.author?.toLowerCase().includes(lowerQuery) ||
      book.genre?.toLowerCase().includes(lowerQuery) ||
      book.language?.toLowerCase().includes(lowerQuery) ||
      book.year?.toString().includes(lowerQuery)
    );
  });


  let filteredBooks = tempFilteredBooks;
  if (searchQuery && tempFilteredBooks.length === 0) {
    if (!toastShownRef.current) {
      toast.warn("No matching books found.", {
        position: "top-center",
        autoClose: 3000,
        pauseOnHover: true,
      });
      toastShownRef.current = true;
    }
    filteredBooks = books;
  } else if (tempFilteredBooks.length > 0) {
    toastShownRef.current = false;
  }

  return (
    <Box p={2}>
      <ToastContainer />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header title="Book List" subtitle="Managing the Books Data" />
        <Link to="/AddBooks" style={{ textDecoration: 'none' }}>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              '&:hover': {
                backgroundColor: colors.blueAccent[600],
              },
            }}
          >
            Add Books
          </Button>
        </Link>
      </Box>

      <Grid container spacing={4}>
        {filteredBooks.map((book) => (
          <Grid key={book._id} item xs={12} sm={6} md={3} display="flex" justifyContent="center">
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: 5,
                width: "250px",
                textAlign: "center",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around"
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    width: "100%",
                    height: "150px",
                    backgroundImage: `url(${book.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "8px",
                    marginBottom: "16px"
                  }}
                />
                <Typography variant="h6" fontWeight="bold" color={colors.blueAccent[600]} gutterBottom>
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary"><strong>Author:</strong> {book.author}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Year:</strong> {book.year}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Genre:</strong> {book.genre}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Language:</strong> {book.language}</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-evenly", px: 2, pb: 2 }}>
                <Button
                  size="small"
                  sx={{
                    backgroundColor: colors.greenAccent[500],
                    color: "white",
                    textTransform: "none",
                    border: "none"
                  }}
                  onClick={() => navigate(`/EditBooks/${book._id}`)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  sx={{
                    backgroundColor: colors.redAccent[500],
                    color: "white",
                    textTransform: "none",
                    border: "none"
                  }}
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this book?")) {
                      handleDelete(book._id);
                    }
                  }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ViewBooks;
