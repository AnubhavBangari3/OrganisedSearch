import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Main from './Main'

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";


export default function Bin() {
  const [token] = useCookies(["access_token"]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBinFiles = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/file/bin/", {
          headers: {
            Authorization: `Bearer ${token["access_token"]}`, // Ensure authentication
          },
        });

        if (!response.ok) throw new Error("Failed to fetch bin files");

        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error("Error fetching bin files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBinFiles();
  }, []);

  return (
    <div>
      <Main/>
    
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="deleted files table">
        <TableHead>
          <TableRow>
            <TableCell><b>Deleted File</b></TableCell>
            <TableCell align="right"><b>Deleted At</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={2} align="center">
                Loading...
              </TableCell>
            </TableRow>
          ) : files.length > 0 ? (
            files.map((file) => (
              <TableRow key={file.id}>
                <TableCell component="th" scope="row">
                  <a href={`http://127.0.0.1:8000${file.fileB}`} target="_blank" rel="noopener noreferrer">
                    {file.fileB.split("/").pop()}
                  </a>
                </TableCell>
                <TableCell align="right">{new Date(file.deleted_at).toLocaleString()}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center">
                No deleted files found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}
