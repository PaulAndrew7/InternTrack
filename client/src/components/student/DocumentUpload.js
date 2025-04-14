import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../layout/Navbar';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';

const DocumentUpload = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [internships, setInternships] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Document types and their keywords for verification
  const documentTypes = {
    'Offer Letter': ['offer letter', 'offer', 'letter'],
    'Completion Certificate': ['completion', 'certificate', 'completion certificate', 'completed'],
    'Internship Report': ['internship', 'report', 'internship report'],
    'Student Feedback': ['feedback', 'student', 'student feedback', 'experience'],
    'Employer Feedback': ['feedback', 'employer', 'employer feedback', 'performance']
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/excel/data');
      if (response.data.success) {
        // Filter internships for the current student
        const studentInternships = response.data.data.filter(
          internship => internship['Register No'] === user.username
        );
        setInternships(studentInternships);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch internships' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (internship, docType, event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Please upload PDF files only' });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('files', file);
      formData.append('username', user.username);
      formData.append('docType', docType);
      formData.append('companyName', internship['Company Name']);

      const response = await axios.post('http://localhost:5000/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        // Verify the document
        const verifyResponse = await axios.post('http://localhost:5000/api/documents/verify', {
          fileId: response.data.uploadedFiles[0].fileId,
          docType,
          keywords: [...documentTypes[docType], internship['Company Name']],
          username: user.username,
          companyName: internship['Company Name']
        });

        setMessage({ 
          type: 'success', 
          text: `Document uploaded and ${verifyResponse.data.verified ? 'verified' : 'pending verification'}`
        });
        fetchInternships(); // Refresh the list
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to upload document'
      });
    } finally {
      setUploading(false);
    }
  };

  const getVerificationStatus = (internship, docType) => {
    const status = internship[docType];
    if (status === 'Yes') return { status: 'verified', icon: <CheckCircleIcon color="success" /> };
    if (status === 'No') return { status: 'unverified', icon: <ErrorIcon color="error" /> };
    return { status: 'pending', icon: <PendingIcon color="warning" /> };
  };

  return (
    <>
      <Navbar title="Document Upload" role="student" />
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>

        {message && (
          <Alert 
            severity={message.type} 
            sx={{ mb: 2 }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {internships.map((internship, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {internship['Company Name']}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {internship['Start Date']} - {internship['End Date']}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      {Object.keys(documentTypes).map((docType) => {
                        const verification = getVerificationStatus(internship, docType);
                        return (
                          <Grid item xs={12} sm={6} md={4} key={docType}>
                            <Paper sx={{ p: 2 }}>
                              <Box display="flex" alignItems="center" mb={1}>
                                {verification.icon}
                                <Typography variant="subtitle1" sx={{ ml: 1 }}>
                                  {docType}
                                </Typography>
                              </Box>
                              <Chip 
                                label={verification.status}
                                color={
                                  verification.status === 'verified' ? 'success' :
                                  verification.status === 'unverified' ? 'error' : 'warning'
                                }
                                size="small"
                              />
                              <Box mt={1}>
                                <Button
                                  component="label"
                                  variant="outlined"
                                  startIcon={<CloudUploadIcon />}
                                  disabled={uploading}
                                  fullWidth
                                >
                                  Upload
                                  <input
                                    type="file"
                                    hidden
                                    accept=".pdf"
                                    onChange={(e) => handleFileUpload(internship, docType, e)}
                                  />
                                </Button>
                              </Box>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default DocumentUpload;