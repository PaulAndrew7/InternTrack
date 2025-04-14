import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../layout/Navbar';
import axios from 'axios';

const AddInternship = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    'Register No': user.username,
    'Name': '',
    'Mobile No': '',
    'Section': '',
    'Obtained Internship': 'Yes',
    'Period': '',
    'Start Date': '',
    'End Date': '',
    'Company Name': '',
    'Placement Source': '',
    'Stipend (Rs.)': '',
    'Internship Type': '',
    'Location': '',
    'Offer Letter Submitted': 'No',
    'Completion Certificate': 'No',
    'Internship Report Submitted': 'No',
    'Student Feedback Submitted': 'No',
    'Employer Feedback Submitted': 'No'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      console.log('Sending add request with data:', formData);
      const response = await axios.post('http://localhost:5000/api/excel/add', formData);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Internship added successfully!' });
        // Wait for 2 seconds before navigating back
        setTimeout(() => {
          navigate('/student/internship');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to add internship.' });
      }
    } catch (error) {
      console.error('Error adding internship:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'An error occurred while adding the internship.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar title="Add Internship" role="student" />
      <Container maxWidth="md" sx={{ mt: 12, mb: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            bgcolor: 'background.default',
            border: '1px solid #e0e0e0'
          }}
        >
          <Typography variant="h5" gutterBottom align="center" sx={{ color: 'text.primary', fontWeight: 600 }}>
            Add New Internship
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
              {/* Personal Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
                  Personal Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="Register No"
                  label="Register Number"
                  name="Register No"
                  value={formData['Register No']}
                  onChange={handleChange}
                  disabled
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="Name"
                  label="Full Name"
                  name="Name"
                  value={formData['Name']}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="Mobile No"
                  label="Mobile Number"
                  name="Mobile No"
                  value={formData['Mobile No']}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="Section"
                  label="Section"
                  name="Section"
                  value={formData['Section']}
                  onChange={handleChange}
                />
              </Grid>

              {/* Internship Information */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
                  Internship Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="internship-label">Obtained Internship</InputLabel>
                  <Select
                    labelId="internship-label"
                    id="Obtained Internship"
                    name="Obtained Internship"
                    value={formData['Obtained Internship']}
                    label="Obtained Internship"
                    onChange={handleChange}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="Period"
                  label="Internship Period (in months)"
                  name="Period"
                  value={formData['Period']}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="Start Date"
                  label="Start Date"
                  name="Start Date"
                  type="date"
                  value={formData['Start Date']}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="End Date"
                  label="End Date"
                  name="End Date"
                  type="date"
                  value={formData['End Date']}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="Company Name"
                  label="Company Name"
                  name="Company Name"
                  value={formData['Company Name']}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="Placement Source"
                  label="Placement Source"
                  name="Placement Source"
                  value={formData['Placement Source']}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="Stipend (Rs.)"
                  label="Stipend (Rs.)"
                  name="Stipend (Rs.)"
                  type="number"
                  value={formData['Stipend (Rs.)']}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="Internship Type"
                  label="Internship Type"
                  name="Internship Type"
                  value={formData['Internship Type']}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="Location"
                  label="Location"
                  name="Location"
                  value={formData['Location']}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={submitting}
                  sx={{
                    bgcolor: 'white',
                    color: 'black',
                    border: '1px solid #e0e0e0',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                    },
                    '&:disabled': {
                      bgcolor: '#f5f5f5',
                      color: '#9e9e9e',
                    },
                  }}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Add Internship'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default AddInternship; 