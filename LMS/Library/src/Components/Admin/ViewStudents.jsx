import {
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "./Theme.js";
import { useNavigate, useOutletContext} from "react-router-dom";
import Header from "./Global/Header";
import { toast, ToastContainer } from "react-toastify";
import { useState, useEffect,useRef } from "react";
import axios from "axios";


function ViewStudents() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [view, setView] = useState([]);
  const { searchQuery, setSearchQuery } = useOutletContext();
  const skipSearchEffect = useRef(false);
  const clearInputFlag = useRef(false);
  const navigate = useNavigate();
  const [filteredView, setFilteredView] = useState([]);

  const [fromBackButton, setFromBackButton] = useState(false);
  const [historyPushed, setHistoryPushed] = useState(false);
  const isMounted = useRef(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isFiltered, setIsFiltered] = useState(false);
  const [toastShown, setToastShown] = useState(false);
  const toastIdRef = useRef(null);

   useEffect(() => {
    isMounted.current = true; 
    return () => {
      isMounted.current = false; 
    };
  }, []);

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
            onClick={() => navigate(`/StudentDetails/${params.row._id}`)}
          >
            View More
          </Button>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:5001/viewAllStudents")
      .then((result) => {
        const students = result.data.data;
        setView(students);
        setFilteredView(students);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to load students");
      });
  }, []);


    useEffect(() => {
    if (!historyPushed) {
      window.history.pushState({ page: 'view-students' }, '', window.location.href);
      setHistoryPushed(true);
    }
  }, [historyPushed]);

  
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
      <ToastContainer />
      <Box p={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mb={2}
        >
          <Header title="Students Data" subtitle="Managing the Students Data" />
        </Box>

        {/* Data Table */}
        <Box height="400px">
          <DataGrid
            rows={filteredView}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
          />
        </Box>
      </Box>
    </>
  );
}

export default ViewStudents;
