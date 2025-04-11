import React, { useState, useContext } from 'react';
import { 
  Container, Typography, Box, Paper, Grid, Button, 
  FormControl, InputLabel, Select, MenuItem, 
  CircularProgress, Alert
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../layout/Navbar';
import axios from 'axios';

const DocumentUpload = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !documentType) {
      setMessage({ type: 'error', text: 'Please select a file and document type' });
      return;
    }

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    formData.append('studentId', user.username);

    try {
      const res = await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setMessage({ type: 'success', text: 'Document uploaded successfully!' });
        setFile(null);
        setDocumentType('');
        // Reset the file input
        document.getElementById('file-upload').value = '';
      } else {
        setMessage({ type: 'error', text: res.data.message || 'Upload failed' });
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'An error occurred during upload' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar title="Document Upload" role="student" />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom align="center">
            Upload Internship Documents
          </Typography>

          {message && (
            <Alert 
              severity={message.type} 
              sx={{ mb: 2 }}
              onClose={() => setMessage(null)}
            >
              {message.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="document-type-label">Document Type</InputLabel>
                  <Select
                    labelId="document-type-label"
                    id="document-type"
                    value={documentType}
                    label="Document Type"
                    onChange={handleDocumentTypeChange}
                  >
                    <MenuItem value="Offer Letter">Offer Letter</MenuItem>
                    <MenuItem value="Completion Certificate">Completion Certificate</MenuItem>
                    <MenuItem value="Internship Report">Internship Report</MenuItem>
                    <MenuItem value="Student Feedback">Student Feedback</MenuItem>
                    <MenuItem value="Employer Feedback">Employer Feedback</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ border: '1px dashed #ccc', p: 3, borderRadius: 1 }}>
                  <input
                    accept="application/pdf"
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-upload">
                    <Button
                      variant="contained"
                      component="span"
                      fullWidth
                    >
                      Select PDF File
                    </Button>
                  </label>
                  {file && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Selected file: {file.name}
                    </Typography>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={uploading || !file || !documentType}
                >
                  {uploading ? <CircularProgress size={24} /> : 'Upload Document'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default DocumentUpload;