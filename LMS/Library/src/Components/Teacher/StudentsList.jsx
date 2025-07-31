import {
  Box,
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "./Theme.js";
import { useNavigate, useOutletContext } from "react-router-dom";
import Header from "./Global/Header";
import { toast, ToastContainer } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

function StudentsList() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useOutletContext();

  const [view, setView] = useState([]);
  const [filteredView, setFilteredView] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastShown, setToastShown] = useState(false);

  const isMounted = useRef(true); 
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const columns = [
    { field: "fname", headerName: "First Name", flex: 1 },
    { field: "lname", headerName: "Last Name", flex: 1 },
    { field: "studclass", headerName: "Class", flex: 1 },
    { field: "rollNumber", headerName: "Roll Number", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1} mt={1}>
          <Button
            size="small"
            variant="contained"
            onClick={() =>
              navigate(`/StudentInfo/${params.row._id}`, {
                state: { from: "/StudentsList" },
              })
            }
          >
            View More
          </Button>
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this student?")) {
                handleDelete(params.row._id);
              }
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    const teacherId = localStorage.getItem("teacherId");
    axios
      .post("http://localhost:5001/viewStudentsByTeacher", { teacherId })
      .then((result) => {
        const students = result.data.data;
        setView(students);
        setFilteredView(students);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to load students");
        setLoading(false);
      });
  }, []);

const skipSearchEffect = useRef(false); 

useEffect(() => {
  if (skipSearchEffect.current) {
    skipSearchEffect.current = false; 
    return;
  }

  const trimmedQuery = searchQuery.trim().toLowerCase();

  if (!trimmedQuery) {
    setFilteredView(view);
    setToastShown(false);
    return;
  }

  const filtered = view.filter((student) =>
    student.fname?.toLowerCase().includes(trimmedQuery) ||
    student.lname?.toLowerCase().includes(trimmedQuery) ||
    student.studclass?.toLowerCase().includes(trimmedQuery) ||
    student.rollNumber?.toLowerCase().includes(trimmedQuery)
  );

  if (filtered.length > 0) {
    setFilteredView(filtered);
    setToastShown(false);

    setTimeout(() => {
      skipSearchEffect.current = true;
      setSearchQuery("");
    }, 300);
  } else {
    if (!toastShown && isMounted.current) {
      toast.warn("No students found matching your search.", {
        position: "top-center",
        autoClose: 3000,
        pauseOnHover: true,
      });
      setToastShown(true);

      setTimeout(() => {
        skipSearchEffect.current = true;
        setSearchQuery("");
      }, 1000);
    }
  }
}, [searchQuery, view]);


  useEffect(() => {
    return () => {
      isMounted.current = false;
      setSearchQuery("");
    };
  }, []);

  const handleDelete = (id) => {
    axios
      .post("http://localhost:5001/deleteStudent", { id })
      .then(() => {
        const updated = view.filter((student) => student._id !== id);
        setView(updated);
        setFilteredView(updated);
        toast.success("Deleted Successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error deleting student");
      });
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={1500} />
      <Box p={2}>
        <Header title="Students Data" subtitle="Managing the Students Data" />
        <Box
          sx={{
            height: isSmallScreen ? "auto" : "400px",
            width: "100%",
            overflowX: "auto",
            overflowY: "auto",
          }}
        >
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={filteredView}
              columns={columns}
              getRowId={(row) => row._id}
              pageSize={isSmallScreen ? 3 : 5}
              rowsPerPageOptions={[5, 10]}
              autoHeight
              disableSelectionOnClick
            />
          )}
        </Box>
      </Box>
    </>
  );
}

export default StudentsList;
