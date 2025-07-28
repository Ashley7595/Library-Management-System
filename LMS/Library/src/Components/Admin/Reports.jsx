import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  useTheme,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { tokens } from "./Theme.js";
import Header from "./Global/Header";
import StatBox from "./Global/StatBox";
import { DataGrid } from "@mui/x-data-grid";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { toast, ToastContainer } from "react-toastify";

function Reports() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [stats, setStats] = useState({ borrowed: 0, due: 0, available: 0 });

  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const columns = [
    { field: "borrowerName", headerName: "Borrower Name", flex: 1 },
    { field: "bookTitle", headerName: "Book Title", flex: 1 },
    { field: "borrowedDate", headerName: "Borrowed Date", flex: 1 },
    { field: "dueDate", headerName: "Due Date", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const status = params.value.toLowerCase();
        const bgColor =
          status === "borrowed"
            ? "#42a5f5"
            : status === "overdue"
            ? "#ef5350"
            : "#66bb6a";

        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "12px",
              backgroundColor: bgColor,
              color: "#fff",
              fontWeight: "bold",
              fontSize: "0.85rem",
            }}
          >
            {params.value}
          </span>
        );
      },
    },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:5001/getAllBorrowRecords")
      .then((res) => {
        const data = res.data.data;

        const formattedRows = data.map((item) => ({
          id: item.id,
          borrowerName: item.borrowerName || "Unknown",
          bookTitle: item.bookTitle || "Unknown",
          borrowedDate: item.borrowedDate
            ? new Date(item.borrowedDate).toLocaleDateString()
            : "N/A",
          dueDate: item.dueDate
            ? new Date(item.dueDate).toLocaleDateString()
            : "N/A",
          status: item.status
            ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
            : "N/A",
        }));

        setRows(formattedRows);
        setFilteredRows(formattedRows);

        const borrowedCount = data.filter((i) => i.status.toLowerCase() === "borrowed").length;
        const overdueCount = data.filter((i) => i.status.toLowerCase() === "overdue").length;

        axios.get("http://localhost:5001/viewAllBooks").then((r2) => {
          const totalBooks = r2.data.data.length;
          setStats({
            borrowed: borrowedCount,
            due: overdueCount,
            available: totalBooks - borrowedCount - overdueCount,
          });
        });
      })
      .catch((err) => console.error("Error fetching reports:", err));
  }, []);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);

  const handleMenuSelect = (type) => {
    setFilterType(type);
    setFilterValue("");
    setAnchorEl(null);
  };

  const applyFilter = () => {
    const value = filterValue.toLowerCase().trim();
    if (!value) {
      setFilteredRows(rows);
      return;
    }

    const filtered = rows.filter((row) => {
      switch (filterType) {
        case "borrower":
          return row.borrowerName.toLowerCase().includes(value);
        case "title":
          return row.bookTitle.toLowerCase().includes(value);
        case "status":
          return row.status.toLowerCase().includes(value);
        default:
          return true;
      }
    });

    if (filtered.length === 0) {
      toast.error(`No results for "${filterValue}". Showing all.`);
      setFilteredRows(rows);
    } else {
      toast.info(`Filtered by ${filterType}: ${filterValue}`);
      setFilteredRows(filtered);
    }
  };

  const clearFilter = () => {
    setFilterType("");
    setFilterValue("");
    setFilteredRows(rows);
    toast.info("Filter cleared");
  };

  return (
    <Box p={0} m={0}>
      <ToastContainer />
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" px={2} pt={2} gap={2}>
        <Header title="Reports" subtitle="Managing Book Reports" />
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
            <MenuItem onClick={() => handleMenuSelect("borrower")}>By Borrower</MenuItem>
            <MenuItem onClick={() => handleMenuSelect("title")}>By Book Title</MenuItem>
            <MenuItem onClick={() => handleMenuSelect("status")}>By Status</MenuItem>
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

      {/* Stat Boxes */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap="16px"
        px={2}
        mt={2}
        mb={2}
        sx={{
          "@media (max-width: 500px)": {
            gridTemplateColumns: "1fr", 
          },
        }}
      >
        <Box
          gridColumn="span 4"
          bgcolor={theme.palette.mode === "dark" ? colors.primary[700] : colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={2}
          borderRadius="10px"
          boxShadow={2}
          sx={{
            "@media (max-width: 500px)": {
              gridColumn: "span 1", 
            },
          }}
        >
          <StatBox title="Borrowed Books" subtitle={stats.borrowed} />
        </Box>

        <Box
          gridColumn="span 4"
          bgcolor={theme.palette.mode === "dark" ? colors.primary[700] : colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={2}
          borderRadius="10px"
          boxShadow={2}
          sx={{
            "@media (max-width: 500px)": {
              gridColumn: "span 1", 
            },
          }}
        >
          <StatBox title="Overdue Books" subtitle={stats.due} />
        </Box>

        <Box
          gridColumn="span 4"
          bgcolor={theme.palette.mode === "dark" ? colors.primary[700] : colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={2}
          borderRadius="10px"
          boxShadow={2}
          sx={{
            "@media (max-width: 500px)": {
              gridColumn: "span 1", 
            },
          }}
        >
          <StatBox title="Available Books" subtitle={stats.available} />
        </Box>
      </Box>

      {/* Table */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
        sx={{
          height: "50vh",
          width: "100%",
          overflowX: "auto",
        }}
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSizeOptions={[5]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}

export default Reports;
