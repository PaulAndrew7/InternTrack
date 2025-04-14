import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../layout/Navbar';
import QuoteGenerator from './QuoteGenerator';
import DocumentStatusFetcher from './DocumentStatusFetcher';
import InternshipOffers from './InternshipOffers';
import WelcomeScreen from './WelcomeScreen';
import { mockOffers } from '../../data/mockData';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [showWelcome, setShowWelcome] = useState(() => {
    // Check if welcome screen has been shown in this session
    return !localStorage.getItem('welcomeShown');
  });

  useEffect(() => {
    if (showWelcome) {
      // Set the flag in localStorage and hide welcome screen after 3 seconds
      const timer = setTimeout(() => {
        localStorage.setItem('welcomeShown', 'true');
        setShowWelcome(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  // Clear the welcomeShown flag when user logs out
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user' && !e.newValue) {
        localStorage.removeItem('welcomeShown');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
          <WelcomeScreen username={user?.username || user?.name || 'User'} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar role="student" />
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
              Welcome, {user?.username || user?.name || 'User'}!
            </Typography>

            <Box sx={{ maxWidth: '800px', mx: 'auto', width: '100%' }}>
              <QuoteGenerator />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                gap: 4,
              }}
            >
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 500,
                    mb: 2
                  }}
                >
                  Document Status
                </Typography>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <DocumentStatusFetcher />
                </Paper>
              </Box>
              
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 500,
                    mb: 2
                  }}
                >
                  Internship Offers
                </Typography>
                <InternshipOffers offers={mockOffers} />
              </Box>
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dashboard;