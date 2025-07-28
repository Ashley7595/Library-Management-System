import {
  Box,
  Button,
  useTheme,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "./Theme.js";
import { useNavigate } from "react-router-dom";
import Header from "./Global/Header";
import { toast, ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

function ViewStudents() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [view, setView] = useState([]);
  const [filteredView, setFilteredView] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

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
      toast.info(`Filtered by ${filterType}: ${filterValue}`);
      setFilteredView(filtered);
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mb={2}
        >
          <Header title="Students Data" subtitle="Managing the Students Data" />

          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            <Button
              onClick={handleMenuClick}
              variant="contained"
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
              }}
              endIcon={<FilterAltIcon />}
            >
              {filterType ? `Filter: ${filterType}` : "Filter"}
            </Button>

            <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
              <MenuItem onClick={() => handleMenuSelect("name")}>By Name</MenuItem>
              <MenuItem onClick={() => handleMenuSelect("class")}>By Class</MenuItem>
              <MenuItem onClick={() => handleMenuSelect("roll")}>By Roll Number</MenuItem>
            </Menu>

            {filterType && (
              <>
                <TextField
                  variant="outlined"
                  size="small"
                  label={`Enter ${filterType}`}
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={applyFilter}
                  disabled={!filterValue.trim()}
                >
                  Apply
                </Button>
                <Button variant="outlined" color="secondary" onClick={clearFilter}>
                  Clear
                </Button>
              </>
            )}
          </Box>
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
