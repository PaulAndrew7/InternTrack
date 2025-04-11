import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }

  // Load user
  const loadUser = async () => {
    try {
      if (token) {
        // Decode token to get user data
        const decoded = jwtDecode(token);
        setUser(decoded.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  // Register user
  const register = async (formData) => {
    try {
      console.log('Sending registration data:', formData);
      const res = await axios.post('/api/auth/register', formData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
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
      const res = await axios.post('/api/auth/login', formData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        setError(null);
        return true;
      }
    } catch (err) {
      setError(err.response.data.message || 'Login failed');
      return false;
    }
    setLoading(false);
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Clear errors
  const clearErrors = () => {
    setError(null);
  };

  useEffect(() => {
    loadUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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