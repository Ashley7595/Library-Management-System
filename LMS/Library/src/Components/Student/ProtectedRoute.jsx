import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRouteStudent = ({ children }) => {
  const student = JSON.parse(localStorage.getItem('student'));

  if (!student || !student._id) {
    return <Navigate to="/StudentLogin" replace />;
  }

  return children;
};


export default ProtectedRouteStudent;
