import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../layout/Navbar';
import QuoteGenerator from './QuoteGenerator';
import DocumentStatus from './DocumentStatus';
import InternshipOffers from './InternshipOffers';
import { mockDocuments, mockOffers } from '../../data/mockData';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
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
            textAlign: 'center', // Center the text
            fontSize: '2.2rem', // Increase font size
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
    </>
  );
};

export default Dashboard;