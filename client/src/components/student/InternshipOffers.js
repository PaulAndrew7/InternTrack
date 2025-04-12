import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Button, Stack } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const InternshipOffers = ({ offers }) => {
  return (
    <Stack spacing={3}>
      {offers.map((offer) => (
        <Card 
          key={offer.id}
          sx={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.primary',
                fontSize: '1rem',
                fontWeight: 500,
                mb: 2
              }}
            >
              {offer.position}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <BusinessIcon sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                {offer.company}
              </Typography>
            </Box>

            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocationOnIcon sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
                <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  {offer.location}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AccessTimeIcon sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
                <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  {offer.duration}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
              {offer.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    height: '24px',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                />
              ))}
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                Apply by {offer.deadline}
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontSize: '0.875rem',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                View Details
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default InternshipOffers; 