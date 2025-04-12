import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import PendingIcon from '@mui/icons-material/Pending';

const DocumentStatus = ({ documents }) => {
  // Group documents by internship
  const documentsByInternship = documents.reduce((acc, document) => {
    if (!acc[document.internshipId]) {
      acc[document.internshipId] = {
        internshipName: document.internshipName,
        documents: []
      };
    }
    acc[document.internshipId].documents.push(document);
    return acc;
  }, {});

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon color="success" />;
      case 'unverified':
        return <WarningIcon color="warning" />;
      case 'pending':
        return <PendingIcon color="disabled" />;
      default:
        return null;
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'verified':
        return (
          <Chip 
            label="Verified" 
            size="small"
            sx={{ 
              bgcolor: 'success.main',
              color: 'success.contrastText',
              '&:hover': { bgcolor: 'success.dark' }
            }}
          />
        );
      case 'unverified':
        return (
          <Chip 
            label="Unverified" 
            size="small"
            sx={{ 
              bgcolor: 'warning.main',
              color: 'warning.contrastText',
              '&:hover': { bgcolor: 'warning.dark' }
            }}
          />
        );
      case 'pending':
        return (
          <Chip 
            label="Pending" 
            size="small"
            variant="outlined"
            sx={{ 
              borderColor: 'text.disabled',
              color: 'text.disabled'
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
        Document Status
      </Typography>
      
      {Object.entries(documentsByInternship).map(([internshipId, { internshipName, documents }]) => (
        <Card 
          key={internshipId}
          sx={{ 
            mb: 2,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
              {internshipName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.disabled' }}>
              {documents.filter(d => d.status === 'verified').length} verified, 
              {documents.filter(d => d.status === 'unverified').length} unverified, 
              {documents.filter(d => d.status === 'pending').length} pending
            </Typography>
            
            <List sx={{ p: 0 }}>
              {documents.map((doc, index) => (
                <React.Fragment key={doc.id}>
                  {index > 0 && <Divider />}
                  <ListItem 
                    sx={{ 
                      py: 1.5,
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderRadius: 1
                      }
                    }}
                  >
                    <ListItemIcon>
                      {getStatusIcon(doc.status)}
                    </ListItemIcon>
                    <ListItemText 
                      primary={doc.name}
                      sx={{ color: 'text.primary' }}
                    />
                    {getStatusChip(doc.status)}
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default DocumentStatus; 