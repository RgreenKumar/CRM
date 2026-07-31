import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const location = useLocation();

  if (!token || !userStr) {
    // Not logged in, redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // Check if user's role is in the allowedRoles array
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Role not authorized, redirect to their respective dashboard
      if (user.role === 'ROLE_ADMIN') {
        return <Navigate to="/admin" replace />;
      } else if (user.role === 'ROLE_MANAGER') {
        return <Navigate to="/manager" replace />;
      } else if (user.role === 'ROLE_SALES') {
        return <Navigate to="/sales" replace />;
      } else {
        // Fallback for unknown roles
        return <Navigate to="/login" replace />;
      }
    }
    
    return children;
  } catch (error) {
    // Error parsing user string
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
