import {
  Box,
  Button,
  useTheme,
  Menu,
  MenuItem,
  TextField,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "./Theme.js";
import { useNavigate } from "react-router-dom";
import Header from "./Global/Header";
import { toast, ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

function StudentsList() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [view, setView] = useState([]);
  const [filteredView, setFilteredView] = useState([]);
  const [filterType, setFilterType] = useState(""); 
  const [filterValue, setFilterValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false); 

  const open = Boolean(anchorEl);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isTabletScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

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

  const handleDelete = (id) => {
    axios
      .post("http://localhost:5001/deleteStudent", { id })
      .then(() => {
        const filtered = view.filter((student) => student._id !== id);
        setView(filtered);
        setFilteredView(filtered);
        toast.success("Deleted Successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error deleting student");
      });
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuSelect = (type) => {
    setFilterType(type);
    setFilterValue("");
    setAnchorEl(null);
  };

  const applyFilter = () => {
    const value = filterValue.toLowerCase().trim();
    if (!value) {
      setFilteredView(view);
      return;
    }

    const filtered = view.filter((student) => {
      switch (filterType) {
        case "name":
          return (
            student.fname?.toLowerCase().includes(value) ||
            student.lname?.toLowerCase().includes(value)
          );
        case "class":
          return student.studclass?.toLowerCase().includes(value);
        case "roll":
          return student.rollNumber?.toLowerCase().includes(value);
        default:
          return true;
      }
    });

    if (filtered.length === 0) {
      toast.error(`No results found for "${filterValue}". Showing all students.`);
      setFilteredView(view); 
    } else {
      setFilteredView(filtered);
      toast.info(`Filtered by ${filterType}: ${filterValue}`);
    }
  };

  const clearFilter = () => {
    setFilteredView(view);
    setFilterValue("");
    setFilterType("");
    toast.info("Filter cleared");
  };

  return (
    <>
      <ToastContainer />
      <Box p={2}>
        <Header title="Students Data" subtitle="Managing the Students Data" />

        <Box
          mb={2}
          display="flex"
          alignItems="center"
          gap={2}
          flexDirection={isSmallScreen ? "column" : "row"}
        >
          <Button
            onClick={handleMenuClick}
            variant="contained"
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              width: isSmallScreen ? "100%" : "auto",
            }}
            endIcon={<FilterAltIcon />}
          >
            {filterType ? `Filter: ${filterType}` : "Select Filter"}
          </Button>

          <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => handleMenuSelect("name")}>By Name</MenuItem>
            <MenuItem onClick={() => handleMenuSelect("class")}>By Class</MenuItem>
            <MenuItem onClick={() => handleMenuSelect("roll")}>By Roll Number</MenuItem>
          </Menu>

          {filterType && (
            <Box display="flex" gap={2} flexDirection={isSmallScreen ? "column" : "row"} alignItems="center">
              <TextField
                variant="outlined"
                size="small"
                label={`Enter ${filterType}`}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={applyFilter}
                disabled={!filterValue}
              >
                Apply
              </Button>
              <Button variant="outlined" color="secondary" onClick={clearFilter}>
                Clear
              </Button>
            </Box>
          )}
        </Box>

        {/* Data Table */}
        <Box
          sx={{
            height: isSmallScreen ? "auto" : "400px",
            width: "100%",
            overflowX: "auto",
            overflowY: "auto",
          }}
        >
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
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
