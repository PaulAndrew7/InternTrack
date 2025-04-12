import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const quotes = [
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "The best way to predict your future is to create it.", author: "Abraham Lincoln" },
  { quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { quote: "Internships are the perfect way to figure out what you do and don't want to do.", author: "Lauren Bush" },
  { quote: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { quote: "The only source of knowledge is experience.", author: "Albert Einstein" },
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
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        p: 3
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormatQuoteIcon 
            sx={{ 
              color: 'text.secondary',
              fontSize: '1.5rem',
              mt: 0.5
            }} 
          />
          <Box>
            <Typography 
              sx={{ 
                color: 'text.primary',
                fontSize: '1rem',
                fontStyle: 'italic',
                mb: 1,
                lineHeight: 1.5
              }}
            >
              {quote.quote}
            </Typography>
            <Typography 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.875rem'
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