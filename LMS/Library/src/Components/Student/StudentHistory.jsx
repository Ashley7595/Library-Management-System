import React, { useEffect, useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "./Theme.js";
import Header from "./Global/Header";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

function StudentHistory() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const columns = [
    { field: "bookTitle", headerName: "Book Title", flex: 1 },
    { field: "borrowedDate", headerName: "Borrowed Date", flex: 1 },
    { field: "dueDate", headerName: "Due Date", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        let status = params.value || "unknown";
        let backgroundColor;

        status = status.trim().toLowerCase();

        switch (status) {
          case "borrowed":
            backgroundColor = "#42a5f5";
            break;
          case "returned":
            backgroundColor = "#66bb6a";
            break;
          case "overdue":
            backgroundColor = "#ef5350";
            break;
          default:
            backgroundColor = "#9e9e9e"; 
            break;
        }

        return (
          <span
            style={{
              padding: "4px 10px",
              borderRadius: "12px",
              backgroundColor,
              color: "#fff",
              fontWeight: "bold",
              fontSize: "0.85rem",
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchBorrowHistory = async () => {
      const studentId = localStorage.getItem("studentId");

      if (!studentId) {
        setError("Student ID not found. Please log in again.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5001/getAllBorrowRecords?studentId=${studentId}`
        );

        const records = response.data.data;

        const formattedRecords = records.map((record) => {
          const currentDate = new Date();
          let status = record.status;

          if (status === "Borrowed" && new Date(record.dueDate) < currentDate) {
            status = "Overdue";
          } else if (status === "Borrowed" && record.returnedDate) {
            status = "Returned";
          }

          return {
            id: record.id,
            borrowerName: record.borrowerName || "Unknown",
            bookTitle: record.bookTitle || "No Book",
            borrowedDate: new Date(record.borrowedDate).toLocaleDateString(),
            dueDate: new Date(record.dueDate).toLocaleDateString(),
            status,
          };
        });

        setBorrowRecords(formattedRecords);
      } catch (err) {
        setError("Failed to fetch borrow history.");
        console.error(err);
      }
    };

    fetchBorrowHistory();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2 }} >
      <Box mb={2}>
        <Header title="HISTORY" subtitle="Borrowed Book History" />
      </Box>

      <Box
        sx={{
          flex: 1,
          height: "calc(100vh - 120px)", 
          backgroundColor:
            theme.palette.mode === "dark" ? colors.primary[600] : "#fff",
          overflow: 'auto', 
        }}
      >
        {error && <div style={{ color: "red", fontSize: "1rem" }}>{error}</div>}

        {borrowRecords.length === 0 ? (
          <div>No borrow records found.</div>
        ) : (
          <DataGrid
            rows={borrowRecords}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row.id}
            initialState={{
              pagination: { paginationModel: { pageSize: 5, page: 0 } },
            }}
            disableRowSelectionOnClick
            sx={{
              height: "100%",
              width: '100%',
              overflowX: 'auto', 
              '& .MuiDataGrid-columnHeader': {
                fontSize: isMobile ? '0.875rem' : '1rem', 
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default StudentHistory;
