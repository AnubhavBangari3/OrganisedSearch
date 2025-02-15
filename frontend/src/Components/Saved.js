import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Main from './Main'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Saved() {
           const [files, setFiles] = useState([]);
           const [token] = useCookies(["access_token"]); 
           const [loading, setLoading] = useState(true);


           useEffect(() => {
                    const fetchSavedFiles = async () => {
                      try {
                        const response = await fetch('http://127.0.0.1:8000/file/saved/', {
                          headers: {
                              Authorization: `Bearer ${token["access_token"]}`, // Ensure the user is authenticated
                          },
                        });
                        if (!response.ok) throw new Error('Failed to fetch files');
                        const data = await response.json();
                        setFiles(data);
                      } catch (error) {
                        console.error('Error fetching saved files:', error);
                      } finally {
                        setLoading(false);
                      }
                    };
                
                    fetchSavedFiles();
                  }, []);


  return (
    <div>
          <Main/>
    
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell align="right">Saved</TableCell>
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
                  <a href={`http://127.0.0.1:8000${file.file}`} target="_blank" rel="noopener noreferrer">
                    {file.file.split('/').pop()}
                  </a>
                </TableCell>
                <TableCell align="right">{file.saved ? '✅' : '❌'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center">
                No saved files found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    
    </div>
  )
}
