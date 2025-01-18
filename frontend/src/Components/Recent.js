import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CircularProgress from "@mui/material/CircularProgress";
import Main from './Main'


import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';

export default function Recent() {
  const [files, setFiles] = useState([]); // State to store the files
  const [loading, setLoading] = useState(true); // State to manage loading
  const [token] = useCookies(["access_token"]); // Authentication token

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/getfiles/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token["access_token"]}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }

        const data = await response.json();
        setFiles(data); // Store fetched files in the state
        setLoading(false); // Disable loading spinner
      } catch (error) {
        console.error("Error fetching files:", error);
        setLoading(false); // Disable loading spinner on error
      }
    };

    fetchFiles();
  }, [token]);

  if (loading) {
    return <CircularProgress />;
  }


  return (
    <div><Main/>
      <div className="searchText">

        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
          {/* <IconButton sx={{ p: '10px' }} aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Text"
            inputProps={{ 'aria-label': 'search google maps' }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
          
          {/*<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
           <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
            <DirectionsIcon />
          </IconButton> */}
        </Paper>
        
      </div>
      
      <div className="recents">
         
          {files.length === 0 ? (
        <p>No files available.</p>
      ) : (
        <List>
          {files.map((file) => (
            <ListItem
              key={file.id}
              component="a"
              href={`http://127.0.0.1:8000/${file.file}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ListItemIcon>
                <CloudDownloadIcon />
              </ListItemIcon>
              <ListItemText primary={file.file.split("/").pop()} />
            </ListItem>
          ))}
        </List>
      )}
      </div>
    </div>
  )
}
