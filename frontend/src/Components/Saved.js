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
  Button,
  CircularProgress,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { CloudDownload as CloudDownloadIcon, Delete as DeleteIcon } from "@mui/icons-material";

export default function Saved() {
  const [files, setFiles] = useState([]);
  const [token] = useCookies(["access_token"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedFiles = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/file/saved/", {
          headers: {
            Authorization: `Bearer ${token["access_token"]}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch files");
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        setError("Failed to fetch saved files. Please try again.");
        console.error("Error fetching saved files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedFiles();
  }, [token]);

  const handleUnsave = async (fileId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/file/unsaved/${fileId}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token["access_token"]}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to unsave file");

      // Update UI after unsaving
      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      setError("Failed to unsave file. Please try again.");
      console.error("Error unsaving file:", error);
    }
  };

  return (
    <div>
      <Main />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Saved Files
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : files.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="saved files table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>File Name</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id} hover>
                    <TableCell component="th" scope="row">
                      <a
                        href={`http://127.0.0.1:8000${file.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {file.file.split("/").pop()}
                      </a>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Unsave">
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleUnsave(file.id)}
                        >
                          Unsave
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6" color="textSecondary">
              No saved files found.
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