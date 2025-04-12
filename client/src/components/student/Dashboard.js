import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../layout/Navbar';
import QuoteGenerator from './QuoteGenerator';
import DocumentStatus from './DocumentStatus';
import InternshipOffers from './InternshipOffers';
import WelcomeScreen from './WelcomeScreen';
import { mockDocuments, mockOffers } from '../../data/mockData';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Show welcome screen for 3 seconds
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
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
          <Navbar />
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
                    color: 'text.secondary',
                    mb: 3,
                    fontSize: '1.25rem',
                    fontWeight: 500,
                  }}
                >
                  Document Status
                </Typography>
                <DocumentStatus documents={mockDocuments} />
              </Box>

              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 3,
                    fontSize: '1.25rem',
                    fontWeight: 500,
                  }}
                >
                  Internship Opportunities
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