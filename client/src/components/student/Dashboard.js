import React, { useContext, useState } from 'react';
import { Container, Box, Grid, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../layout/Navbar';
import WelcomeScreen from './WelcomeScreen';
import QuoteGenerator from './QuoteGenerator';
import DocumentStatus from './DocumentStatus';
import InternshipOffers from './InternshipOffers';
import { mockDocuments, mockOffers } from '../../data/mockData';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleAnimationComplete = () => {
    setTimeout(() => {
      setShowWelcome(false);
    }, 2000);
  };

  return (
    <>
      <Navbar title="Student Dashboard" role="student" />
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: -1000 }}
            transition={{ duration: 1, ease: [0.23, 0.86, 0.39, 0.96] }}
          >
            <WelcomeScreen username={user.username} onAnimationComplete={handleAnimationComplete} />
          </motion.div>
        )}
      </AnimatePresence>
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          opacity: showWelcome ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out',
          bgcolor: 'background.default',
          pt: 12,
          px: 3
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4,
                color: 'text.primary',
                fontWeight: 500,
                fontSize: { xs: '1.75rem', md: '2.25rem' }
              }}
            >
              Hello, {user.username}! 
            </Typography>
            <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
              <QuoteGenerator />
            </Box>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <DocumentStatus documents={mockDocuments} />
            </Grid>
            
            <Grid item xs={12} lg={4}>
              <InternshipOffers offers={mockOffers} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;