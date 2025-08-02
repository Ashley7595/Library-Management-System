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
  const [historyPushed, setHistoryPushed] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [fromBackButton, setFromBackButton] = useState(false);

  const skipSearchEffect = useRef(false);
  const isMounted = useRef(false);
  const toastIdRef = useRef(null);
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
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

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



  useEffect(() => {
    if (!historyPushed) {
      window.history.pushState({ page: 'student-list' }, '', window.location.href);
      setHistoryPushed(true);
    }
  }, [historyPushed]);

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

  useEffect(() => {
    if (skipSearchEffect.current) {
      skipSearchEffect.current = false;
      return;
    }

    const trimmedQuery = searchQuery.trim().toLowerCase();

    if (!trimmedQuery) {
      setFilteredView(view);
      setIsFiltered(false);
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
      setIsFiltered(true);
      setToastShown(false);

      window.history.pushState({ isSearch: true, query: searchQuery }, '');

      setTimeout(() => {
        skipSearchEffect.current = true;
        setSearchQuery("");
      }, 300);
    } else {
      if (!toastShown && isMounted.current) {
        toastIdRef.current = toast.warn("No students found matching your search.", {
          position: "top-center",
          autoClose: 3000,
          pauseOnHover: true,
        });
        setToastShown(true);
      }

      setTimeout(() => {
        skipSearchEffect.current = true;
        setSearchQuery("");
      }, 1000);
    }
  }, [searchQuery, view]);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.isSearch) {
        skipSearchEffect.current = true;
        setFilteredView(view);
        setIsFiltered(false);
        setSearchQuery("");
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [view, setSearchQuery]);

    useEffect(() => {
    if (skipSearchEffect.current) {
      skipSearchEffect.current = false;
      return;
    }

    const trimmedQuery = searchQuery.trim().toLowerCase();

    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }

    if (!trimmedQuery) {
      if (fromBackButton) {
        setFilteredView(view);
        setIsFiltered(false);
        setFromBackButton(false);
      }
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
      setIsFiltered(true);
      setToastShown(false);

      if (!fromBackButton) {
        window.history.pushState({ 
          isSearch: true, 
          query: searchQuery,
          filteredIds: filtered.map(s => s._id) 
        }, '');
      }

      setTimeout(() => {
        skipSearchEffect.current = true;
        setSearchQuery("");
      }, 300);
    } else {
      if (!toastShown && isMounted.current) {
        toastIdRef.current = toast.warn("No students found matching your search.", {
          position: "top-center",
          autoClose: 3000,
          pauseOnHover: true,
        });
        setToastShown(true);
      }

      setTimeout(() => {
        skipSearchEffect.current = true;
        setSearchQuery("");
      }, 1000);
    }
  }, [searchQuery, view, fromBackButton]);

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