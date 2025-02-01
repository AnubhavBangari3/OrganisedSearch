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

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Stack from '@mui/material/Stack';


export default function Recent() {
  const [files, setFiles] = useState([]); // State to store the files
  //const [loading, setLoading] = useState(true); // State to manage loading
  const [token] = useCookies(["access_token"]); // Authentication token
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false); 


  const [searchText,setsearchText]=useState("")

  //for modal start
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height:'60%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow:'auto',
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = async () => {
    setSearchLoading(true); 
    //console.log("searchLoading 1:",searchLoading)
    fetch(`http://127.0.0.1:8000/search/?q=${searchText}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token["access_token"]}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data); // Set search results
        setOpen(true); // Open modal
        setSearchLoading(false); 
        
      
      })
      .catch((error) => console.error("Error fetching search results:", error))
      .finally(() => setSearchLoading(false)); 
  };
  const handleClose = () => setOpen(false);
  console.log("searchResults after:",searchResults);

  //for modal end

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
      } catch (error) {
        console.error("Error fetching files:", error);
        // Optionally, you could set an error state to display an error message
      } 
    };
  
    fetchFiles();
  }, [token]);
  

 console.log("File:",files)


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
            value={searchText}
            onChange={e => setsearchText(e.target.value)}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon onClick={handleOpen} />
          </IconButton>
          
  
        </Paper>
        
      </div>

      <div className="forModal">
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography id="transition-modal-title" variant="h6" component="h2">
                Search Results
              </Typography>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                <b>Search Text: {searchText}</b>
              </Typography>
              {searchLoading ? (
              <CircularProgress /> // Show loading spinner inside modal
            ) : searchResults.data && searchResults.data.length > 0 ? (
              <ul>
                {searchResults.data.map((result, index) => {
                  // Find the corresponding file in the `files` list
                  const matchingFile = files.find((file) => file.file.split("/").pop() === result.file_name.split("/").pop());
                  
                  return (
                    <li key={index}>
                      <b>File Name:</b>{" "}
                      {matchingFile ? (
                        <a
                          href={`http://127.0.0.1:8000/${matchingFile.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {result.file_name}
                        </a>
                      ) : (
                        result.file_name
                      )}
                      <br />
                      <b>Matching Sentences:</b>
                      <ul>
                        {result.matching_sentences.map((sentence, i) => (
                          <li key={i}>{sentence}</li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <Typography>No results found for "{searchText}"</Typography>
            )}
            </Box>
          </Fade>
        </Modal>
      </div>
      { searchLoading === true && (
      <div
        style={{
          position: 'fixed', // Fixed position on screen
          top: '50%', // Center vertically
          left: '50%', // Center horizontally
          transform: 'translate(-50%, -50%)', // Offset by half its size to truly center it
          zIndex: 9999, // Make sure it appears on top of other content
        }}
      >
        <CircularProgress color="success" />
    </div>
      )}
      
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
