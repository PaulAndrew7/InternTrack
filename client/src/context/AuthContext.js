import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (formData) => {
    try {
      console.log('Sending registration data:', formData);
      const res = await api.post('/api/auth/register', formData);
      
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        setIsAuthenticated(true);
        setError(null);
        return true;
      } else {
        setError(res.data.message || 'Registration failed');
        return false;
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      console.log('Sending login data:', formData);
      const res = await api.post('/api/auth/login', formData);
      
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        setIsAuthenticated(true);
        setError(null);
        return true;
      } else {
        setError(res.data.message || 'Login failed');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('welcomeShown');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Clear errors
  const clearErrors = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};