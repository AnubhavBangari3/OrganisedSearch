import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Main from "./Main";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box, // Import the Box component
  Snackbar,
  Alert,
} from "@mui/material";

export default function Bin() {
  const [token] = useCookies(["access_token"]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBinFiles = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/file/bin/", {
          headers: {
            Authorization: `Bearer ${token["access_token"]}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch bin files");

        const data = await response.json();
        setFiles(data);
      } catch (error) {
        setError("Failed to fetch bin files. Please try again.");
        console.error("Error fetching bin files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBinFiles();
  }, [token]);

  return (
    <div>
      <Main />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Deleted Files
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : files.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="deleted files table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Deleted File</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>Deleted At</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id} hover>
                    <TableCell component="th" scope="row">
                      <a
                        href={`http://127.0.0.1:8000${file.fileB}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {file.fileB.split("/").pop()}
                      </a>
                    </TableCell>
                    <TableCell align="right">
                      {new Date(file.deleted_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" color="textSecondary">
              No deleted files found.
            </Typography>
          </Box>
        )}

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
}