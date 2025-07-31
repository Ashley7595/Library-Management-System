import {
  Box,
  Button,
  useTheme,
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
  if (skipSearchEffect.current) {
    skipSearchEffect.current = false;
    return;
  }

  const value = searchQuery.toLowerCase().trim();

  if (!value) {
    setFilteredView(view);
    return;
  }

  const filtered = view.filter((student) =>
     student.fname?.toLowerCase().includes(value) ||
    student.lname?.toLowerCase().includes(value) ||
    student.studclass?.toLowerCase().includes(value) ||
    student.rollNumber?.toLowerCase().includes(value)
  );

  if (filtered.length === 0) {
    toast.error(`No results found for "${searchQuery}". Showing all students.`);
    setFilteredView(view);
    clearInputFlag.current = true;
  } else {
    setFilteredView(filtered);
    toast.success(`Showing results for "${searchQuery}"`);
    clearInputFlag.current = true;
  }

  if (clearInputFlag.current) {
    const timeout = setTimeout(() => {
      skipSearchEffect.current = true;
      setSearchQuery('');
      clearInputFlag.current = false;
    }, 1000); 

    return () => clearTimeout(timeout);
  }

}, [searchQuery, view]);

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
