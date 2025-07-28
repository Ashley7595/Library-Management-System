import React, { useEffect, useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "./Theme.js";
import Header from "./Global/Header";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

function TeacherHistory() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); 

  const [borrowRecords, setBorrowRecords] = useState([]);
  const [error, setError] = useState(null);

  const columns = [
    { field: "bookTitle", headerName: "Book Title", flex: 1 },
    { field: "borrowedDate", headerName: "Borrowed Date", flex: 1 },
    { field: "dueDate", headerName: "Due Date", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        let status = params.value;
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
            backgroundColor = "#eeeeee"; 
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
      const teacherId = localStorage.getItem("teacherId");

      if (!teacherId) {
        setError("Teacher ID not found. Please log in again.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5001/getAllBorrowRecords?teacherId=${teacherId}`
        );

        const records = response.data.data;

        const formattedRecords = records
          .map((record) => {
            if (!record.bookTitle) {
              console.warn("Missing bookTitle in borrow record:", record);
              return null; 
            }

            const currentDate = new Date();
            let status = record.status;

            if (
              status.toLowerCase() === "borrowed" &&
              new Date(record.dueDate) < currentDate
            ) {
              status = "Overdue";
            } else if (
              status.toLowerCase() === "borrowed" &&
              record.returnedDate
            ) {
              status = "Returned";
            }

            return {
              id: record.id,
              borrowerName:
                record.borrowerName ||
                `${record.teacherId?.fname || ""} ${record.teacherId?.lname || ""}`.trim() ||
                "Unknown",
              bookTitle: record.bookTitle || "No Book",
              borrowedDate: record.borrowedDate
                ? new Date(record.borrowedDate).toLocaleDateString()
                : "N/A",
              dueDate: record.dueDate
                ? new Date(record.dueDate).toLocaleDateString()
                : "N/A",
              status,
            };
          })
          .filter((r) => r !== null);

        setBorrowRecords(formattedRecords);
      } catch (err) {
        setError("Failed to fetch borrow history.");
        console.error(err);
      }
    };

    fetchBorrowHistory();
  }, []);

  return (
    <Box p={2}>
      <Box mb={3}>
        <Header title="HISTORY" subtitle="Borrowed Book History" />
      </Box>

      <Box
        height={isSmallScreen ? "auto" : "60vh"} 
        borderRadius="12px"
        boxShadow={4}
        p={2}
        sx={{
          backgroundColor:
            theme.palette.mode === "dark" ? colors.primary[600] : "#fff",
        }}
      >
        {error && <div style={{ color: "red" }}>{error}</div>}

        <DataGrid
          rows={borrowRecords}
          columns={columns}
          pageSize={isSmallScreen ? 3 : 5} 
          initialState={{
            pagination: { paginationModel: { pageSize: isSmallScreen ? 3 : 5, page: 0 } },
          }}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}

export default TeacherHistory;
