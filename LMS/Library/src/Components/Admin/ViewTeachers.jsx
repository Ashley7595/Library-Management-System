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

function ViewTeachers() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [view, setView] = useState([]);
  const [filteredView, setFilteredView] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const open = Boolean(anchorEl);

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

    const filtered = view.filter((teacher) => {
      switch (filterType) {
        case "name":
          return (
            teacher.fname?.toLowerCase().includes(value) ||
            teacher.lname?.toLowerCase().includes(value)
          );
        case "email":
          return teacher.email?.toLowerCase().includes(value);
        case "phone":
          return teacher.phone?.toLowerCase().includes(value);
        default:
          return true;
      }
    });

    if (filtered.length === 0) {
      toast.error(`No results found for "${filterValue}". Showing all teachers.`);
      setFilteredView(view);
    } else {
      toast.info(`Filtered by ${filterType}: ${filterValue}`);
      setFilteredView(filtered);
    }
  };

  const clearFilter = () => {
    setFilteredView(view);
    setFilterType("");
    setFilterValue("");
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

        <Header title="Teachers Data" subtitle="Managing the Teachers Data" />

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
            <MenuItem onClick={() => handleMenuSelect("email")}>By Email</MenuItem>
            <MenuItem onClick={() => handleMenuSelect("phone")}>By Phone</MenuItem>
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

export default ViewTeachers;
