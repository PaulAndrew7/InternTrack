import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/routing/PrivateRoute';
import TeacherRoute from './components/routing/TeacherRoute';
import Box from '@mui/material/Box';

// Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StudentDashboard from './components/student/Dashboard';
import TeacherDashboard from './components/teacher/Dashboard';
import StudentDetails from './components/student/StudentDetails';
import DocumentUpload from './components/student/DocumentUpload';
import ViewRecords from './components/teacher/ViewRecords';
import UploadExcel from './components/teacher/UploadExcel';
import NotFound from './components/layout/NotFound';
import LandingPage from './components/landing/LandingPage';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#b3b3b3',
    },
    secondary: {
      main: '#808080',
      light: '#b3b3b3',
      dark: '#4d4d4d',
    },
    background: {
      default: '#000000',
      paper: '#121212',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.3s ease',
          background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            background: 'linear-gradient(145deg, #2a2a2a 0%, #3a3a3a 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
          background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.05)',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.05)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Student Routes */}
              <Route 
                path="/student/dashboard" 
                element={
                  <PrivateRoute>
                    <StudentDashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/student/details" 
                element={
                  <PrivateRoute>
                    <StudentDetails />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/student/documents" 
                element={
                  <PrivateRoute>
                    <DocumentUpload />
                  </PrivateRoute>
                } 
              />
              
              {/* Teacher Routes */}
              <Route 
                path="/teacher/dashboard" 
                element={
                  <TeacherRoute>
                    <TeacherDashboard />
                  </TeacherRoute>
                } 
              />
              <Route 
                path="/teacher/records" 
                element={
                  <TeacherRoute>
                    <ViewRecords />
                  </TeacherRoute>
                } 
              />
              <Route 
                path="/teacher/upload" 
                element={
                  <TeacherRoute>
                    <UploadExcel />
                  </TeacherRoute>
                } 
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;