import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRouteAdmin = ({ children }) => {
  let admin = null;

  try {
    admin = JSON.parse(localStorage.getItem('admin'));
  } catch (error) {
    console.error('Error parsing admin data from localStorage:', error);
  }

  if (!admin || !admin._id) {
    return <Navigate to="/Login" replace />;
  }

  return children;
};


export default ProtectedRouteAdmin;
