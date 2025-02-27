import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import Main from './Main';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function FileUp() {
  const [file, setFile] = useState(null);
  const [token] = useCookies(['access_token']);
  const [fileuploaded, setFileuploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  let history = useHistory();

  const handleFileChange = (e) => {
    if (e.target.files) {
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
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const result = await fetch('http://127.0.0.1:8000/uploadfile/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token['access_token']}`,
          },
          body: formData,
        });

        const data = await result.json();
        setFileuploaded(true);
        setUploading(false);
        console.log('File data:', data);
      } catch (error) {
        console.error(error);
        setError('File upload failed. Please try again.');
        setUploading(false);
      }
    }
  };

  const handleCloseAlert = () => {
    setFileuploaded(false);
  };

  return (
    <div>
      <Main />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: '80vh' }}
      >
        <Grid item xs={12} md={6}>
          <Typography variant="h4" align="center" gutterBottom>
            Upload Your File
          </Typography>
          <div style={{ textAlign: 'center' }}>
            <Button
              component="label"
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              style={{ marginBottom: '16px' }}
            >
              Choose File
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileChange}
              />
            </Button>
            {file && (
              <Typography variant="body1" style={{ marginBottom: '16px' }}>
                Selected File: {file.name}
              </Typography>
            )}
            {file && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpload}
                disabled={uploading}
                style={{ marginBottom: '16px' }}
              >
                {uploading ? <CircularProgress size={24} /> : 'Upload'}
              </Button>
            )}
            {error && (
              <Alert severity="error" style={{ marginBottom: '16px' }}>
                {error}
              </Alert>
            )}
          </div>
        </Grid>
      </Grid>
      <Snackbar
        open={fileuploaded}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          onClose={handleCloseAlert}
        >
          File uploaded successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}