import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../layout/Navbar';
import WelcomeScreen from '../student/WelcomeScreen';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalStudents: 0,
    internshipObtained: 0,
    documentsSubmitted: 0
  });
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Show welcome screen on every login
    setShowWelcome(true);

    // Hide welcome screen after 3 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [user]); // Re-run when user changes (login/logout)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/students/stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showWelcome ? (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WelcomeScreen username={user?.username || 'Teacher'} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar title="Teacher Dashboard" role="teacher" />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Welcome Section */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h4" gutterBottom>
                    Welcome, {user?.username || 'Teacher'}
                  </Typography>
                  <Typography variant="body1">
                    Manage student internship records and documents from this dashboard.
                  </Typography>
                </Paper>
              </Grid>

              {/* Stats Cards */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Total Students
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
                    {loading ? '...' : stats.totalStudents}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Internships Obtained
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
                    {loading ? '...' : stats.internshipObtained}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Documents Submitted
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
                    {loading ? '...' : stats.documentsSubmitted}
                  </Typography>
                </Paper>
              </Grid>

              {/* Quick Actions */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                    <Button 
                      variant="contained" 
                      component={Link} 
                      to="/view-records"
                    >
                      View Student Records
                    </Button>
                    <Button 
                      variant="contained" 
                      component={Link} 
                      to="/upload-excel"
                    >
                      Upload Excel File
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dashboard;