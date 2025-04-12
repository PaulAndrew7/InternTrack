import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const quotes = [
  { quote: "The only source of knowledge is experience.", author: "Albert Einstein" },
  { quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "The best way to predict your future is to create it.", author: "Abraham Lincoln" },
  { quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { quote: "Internships are the perfect way to figure out what you do and don't want to do.", author: "Lauren Bush" },
  { quote: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "It is never too late to be what you might have been.", author: "George Eliot" }
];

const QuoteGenerator = () => {
  const [quote, setQuote] = useState({ quote: "", author: "" });

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <Card 
      sx={{ 
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
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: 3,
          maxWidth: '600px',
          mx: 'auto'
        }}>
          <FormatQuoteIcon sx={{ 
            color: 'text.secondary', 
            fontSize: '2rem',
            flexShrink: 0,
            mt: 1
          }} />
          <Box>
            <Typography 
              variant="body1" 
              sx={{ 
                fontStyle: 'italic',
                color: 'text.primary',
                mb: 1,
                fontSize: { xs: '1rem', md: '1.25rem' },
                textAlign: 'left'
              }}
            >
              {quote.quote}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', md: '1rem' },
                display: 'block',
                textAlign: 'right'
              }}
            >
              — {quote.author}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuoteGenerator; 