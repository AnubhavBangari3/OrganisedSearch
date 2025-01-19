import React,{useState,useEffect} from 'react'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useCookies} from 'react-cookie'
import {useHistory} from 'react-router-dom'
import Main from './Main';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

export default function FileUp() {
          const [file, setFile] = useState([]);
          const [token, setToken, removeToken] = useCookies(["access_token"]);
      const [tokenR, setTokenR, removeTokenR] = useCookies(["refresh_token"]);

      const [fileuploaded,setfileuploaded]= useState(false);
    


  let history=useHistory();
          
          const handleFileChange = (e) => {
            if (e.target.files) {
              console.log("File name:",e.target.files[0]);
              setFile(e.target.files[0]);
            }
          };
          
          

          const VisuallyHiddenInput = styled('input')({
                    clip: 'rect(0 0 0 0)',
                    clipPath: 'inset(50%)',
                    height: 1,
                    overflow: 'hidden',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    whiteSpace: 'nowrap',
                    width: 1,
                  });

                  const handleUpload = async () => {
                    if (file) {
                      console.log('Uploading file...');
                  
                      const formData = new FormData();
                      formData.append('file', file);
                  
                      try {
                        // You can write the URL of your server or any other endpoint used for file upload
                        const result = await fetch('http://127.0.0.1:8000/uploadfile/', {
                          method: 'POST',
                          headers:{
                           // 'Content-Type':'application/json',
                            'Authorization':`Bearer ${token['access_token']}`,
                          },
                          body: formData,
                        });
                  
                        const data = await result.json();
                        setfileuploaded(true);
                        console.log("File data:",data);
                      } catch (error) {
                        console.error(error);
                        setfileuploaded(false);
                      
                      }
                    }
                  };
                  
  return (
    <div>
          <Main/>
          <div className="fileUpload">
                    <Button
                              component="label"
                              role={undefined}
                              variant="contained"
                              tabIndex={-1}
                              startIcon={<CloudUploadIcon />}
                    
                    >
                              Upload files
                              <VisuallyHiddenInput
                              type="file"
                              onChange={handleFileChange}
                              multiple
                              />
                    </Button>
                    {file && (
                    <button
                              onClick={handleUpload}
                              className="submit"
                    >Post</button>
                    )}
                    { fileuploaded && ( <Alert icon={<CheckIcon fontSize="inherit" />} severity="success" onClose={() => {setfileuploaded(false);}}>
                    
                  File uploaded
                </Alert>) }
               
         
         </div>
           

    </div>
  )
}
