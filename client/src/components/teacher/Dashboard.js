import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../layout/Navbar';
import WelcomeScreen from '../student/WelcomeScreen';
import QuoteGenerator from '../student/QuoteGenerator';
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
          <Navbar role="teacher" />
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              p: 4,
              minHeight: '100vh',
              bgcolor: 'background.default',
              mt: '64px' // Add margin top to account for fixed navbar
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                color: 'text.primary',
                fontWeight: 600,
                textAlign: 'center',
                fontSize: '2.2rem',
                mb: 1
              }}
            >
              Welcome, {user?.username || 'Teacher'}!
            </Typography>

            <Box sx={{ maxWidth: '800px', mx: 'auto', width: '100%' }}>
              <QuoteGenerator />
            </Box>

            {/* Stats Cards */}
            <Box sx={{ maxWidth: '1200px', mx: 'auto', width: '100%' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Total Students
                  </Typography>
                  <Typography variant="h3" component="div">
                    {loading ? '...' : stats.totalStudents}
                  </Typography>
                </Box>
                <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Internships Obtained
                  </Typography>
                  <Typography variant="h3" component="div">
                    {loading ? '...' : stats.internshipObtained}
                  </Typography>
                </Box>
                <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Documents Submitted
                  </Typography>
                  <Typography variant="h3" component="div">
                    {loading ? '...' : stats.documentsSubmitted}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dashboard;