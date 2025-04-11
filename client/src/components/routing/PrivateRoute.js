import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;