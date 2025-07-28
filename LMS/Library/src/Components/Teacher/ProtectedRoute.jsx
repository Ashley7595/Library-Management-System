import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRouteTeacher = ({ children }) => {
  let teacher = null;
  
  try {
    teacher = JSON.parse(localStorage.getItem('teacher'));
  } catch (error) {
    console.error('Error parsing teacher data from localStorage:', error);
  }

  if (!teacher || !teacher._id) {
    return <Navigate to="/TeacherLogin" replace />;
  }

  return children;
};

export default ProtectedRouteTeacher;
