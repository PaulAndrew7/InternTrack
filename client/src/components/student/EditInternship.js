import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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


const EditInternship = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    'Register No': '',
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

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/excel/data');
        const allInternships = response.data.data;
        const studentInternships = allInternships.filter(
          internship => internship['Register No'] === user.username
        );

        const internshipToEdit = studentInternships[parseInt(id)];
        if (internshipToEdit) {
          // Ensure all document status fields have default values
          const updatedFormData = {
            ...internshipToEdit,
            'Offer Letter Submitted': internshipToEdit['Offer Letter Submitted'] || 'No',
            'Completion Certificate': internshipToEdit['Completion Certificate'] || 'No',
            'Internship Report Submitted': internshipToEdit['Internship Report Submitted'] || 'No',
            'Student Feedback Submitted': internshipToEdit['Student Feedback Submitted'] || 'No',
            'Employer Feedback Submitted': internshipToEdit['Employer Feedback Submitted'] || 'No'
          };
          setFormData(updatedFormData);
        } else {
          setMessage({ type: 'error', text: 'Internship not found' });
        }
      } catch (error) {
        console.error('Error fetching internship:', error);
        setMessage({ 
          type: 'error', 
          text: error.response?.data?.message || 'Failed to fetch internship details' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id, user.username]);

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
      console.log('Sending update request with data:', formData);
      console.log('Update URL:', `http://localhost:5000/api/excel/update/${id}`);
      
      // Ensure we're sending the correct content type
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const response = await axios.put(
        `http://localhost:5000/api/excel/update/${id}`, 
        formData,
        config
      );
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Internship details updated successfully!' });
        setTimeout(() => {
          navigate('/student/internship');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to update internship details.' });
      }
    } catch (error) {
      console.error('Error updating internship:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'An error occurred while updating details.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar title="Edit Internship" role="student" />
        <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar title="Edit Internship" role="student" />
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
            Edit Internship Details
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
                  {submitting ? <CircularProgress size={24} /> : 'Update Internship'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default EditInternship;