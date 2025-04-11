import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Box, Button, styled } from '@mui/material';

const FloatingPaths = ({ position }) => {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
      }}
    >
      <svg
        style={{
          width: '100%',
          height: '100%',
          color: '#fff',
        }}
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </Box>
  );
};

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '16px 32px',
  fontSize: '1.125rem',
  fontWeight: 600,
  borderRadius: '1rem',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#fff',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
}));

const LandingPage = () => {
  const navigate = useNavigate();
  const title = 'Welcome To InternTrack';
  const words = title.split(' ');

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        bgcolor: '#000000',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(2px)',
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(75,0,130,0.05), transparent, rgba(255,0,0,0.05))',
          filter: 'blur(100px)',
        }}
      />

      <Box sx={{ position: 'absolute', inset: 0 }}>
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px',
          mx: 'auto',
          px: 4,
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {/* Welcome To */}
          <Box sx={{ mb: 2 }}>
            {'Welcome\u00A0To'.split('').map((letter, index) => (
              <motion.span
                key={`welcome-${index}`}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.03,
                  type: 'spring',
                  stiffness: 120,
                  damping: 30,
                }}
                style={{
                  display: 'inline-block',
                  color: '#8a8686',
                  fontSize: '50px',
                  fontWeight: 400,
                  fontFamily:
                    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  letterSpacing: '-0.05em',
                  lineHeight: 0.9,
                }}
              >
                {letter}
              </motion.span>
            ))}
          </Box>

          {/* InternTrack */}
          <Box sx={{ mb: 8 }}>
            {'InternTrack'.split('').map((letter, index) => (
              <motion.span
                key={`intern-${index}`}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.03 + 0.5, // slight delay after Welcome To
                  type: 'spring',
                  stiffness: 120,
                  damping: 30,
                }}
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(to bottom, #aaa, #ddd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '150px',
                  fontWeight: 800,
                  fontFamily:
                    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  letterSpacing: '-0.05em',
                  lineHeight: 0.9,
                }}
              >
                {letter}
              </motion.span>
            ))}
          </Box>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1.8 }}
          >
            <StyledButton
              onClick={handleGetStarted}
              sx={{
                fontFamily:
                  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              Login
              <motion.span
                style={{
                  display: 'inline-block',
                  marginLeft: '8px',
                  opacity: 0.7,
                }}
                animate={{
                  x: [0, 4, 0],
                }}
                transition={{
                  duration: .5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                →
              </motion.span>
            </StyledButton>
          </motion.div>
        </motion.div>
      </Box>
    </Box>
  );
};

export default LandingPage;
