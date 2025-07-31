import {
  Box,
  Button,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "./Theme.js";
import { useNavigate, useOutletContext } from "react-router-dom";
import Header from "./Global/Header";
import { toast, ToastContainer } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

function ViewTeachers() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useOutletContext();
  const skipSearchEffect = useRef(false);
  const clearInputFlag = useRef(false);

  const [view, setView] = useState([]);
  const [filteredView, setFilteredView] = useState([]);

  const columns = [
    { field: "fname", headerName: "First Name", flex: 1 },
    { field: "lname", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1} mt={1}>
          <Button
            size="small"
            variant="contained"
            onClick={() => navigate(`/Teachers/${params.row._id}`)}
          >
            View More
          </Button>
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this teacher?")) {
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
    axios
      .get("http://localhost:5001/viewAllTeachers")
      .then((result) => {
        const teachers = result.data.data;
        setView(teachers);
        setFilteredView(teachers);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to load teachers");
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .post("http://localhost:5001/deleteTeacher", { id })
      .then(() => {
        const updated = view.filter((teacher) => teacher._id !== id);
        setView(updated);
        setFilteredView(updated);
        toast.success("Deleted Successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error Deletion");
      });
  };


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

  const filtered = view.filter((teacher) =>
    teacher.fname?.toLowerCase().includes(value) ||
    teacher.lname?.toLowerCase().includes(value) ||
    teacher.email?.toLowerCase().includes(value) ||
    teacher.phone?.toLowerCase().includes(value)
  );

  if (filtered.length === 0) {
    toast.error(`No results found for "${searchQuery}". Showing all teachers.`);
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
          <Header title="Teachers Data" subtitle="Managing the Teachers Data" />
        </Box>

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

export default ViewTeachers;
