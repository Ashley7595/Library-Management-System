import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import App from './App.jsx';
import LandingPage from './Components/Common/LandingPage.jsx';
import Register from './Components/Common/Register.jsx';
import About from './Components/Common/About.jsx';
import Contact from './Components/Common/Contact.jsx';

import Login from './Components/Admin/Login.jsx';
import Dashboard from './Components/Admin/Dashboard.jsx';
import AdminLayout from './Components/Admin/AdminLayout.jsx';
import ViewTeachers from "./Components/Admin/ViewTeachers.jsx";
import TeacherDetails from './Components/Admin/TeacherDetails.jsx';
import ViewStudents from "./Components/Admin/ViewStudents.jsx";
import StudentDetails from './Components/Admin/StudentDetails.jsx';
import ViewBooks from './Components/Admin/ViewBooks.jsx';
import AddBooks from './Components/Admin/AddBooks.jsx';
import EditBooks from './Components/Admin/EditBooks.jsx';
import Reports from './Components/Admin/Reports.jsx';
import ProtectedRouteAdmin from './Components/Admin/ProtectedRoute.jsx';


import TeacherLogin from './Components/Teacher/Login.jsx';
import TeacherLayout from './Components/Teacher/TeacherLayout.jsx';
import TeacherDashboard from './Components/Teacher/TeacherDashboard.jsx';
import TeacherProfile from './Components/Teacher/TeacherProfile.jsx';
import EditTeacherProfile from './Components/Teacher/EditTeacherProfile.jsx';
import TeacherHistory from './Components/Teacher/TeacherHistory.jsx';
import AddStudent from './Components/Teacher/AddStudent.jsx';
import StudentsList from './Components/Teacher/StudentsList.jsx';
import StudentInfo from './Components/Teacher/StudentInfo.jsx';
import ProtectedRouteTeacher from './Components/Teacher/ProtectedRoute.jsx';


import StudentLogin from './Components/Student/Login.jsx';
import StudentLayout from './Components/Student/StudentLayout.jsx';
import StudentDashboard from './Components/Student/StudentDashboard.jsx';
import StudentProfile from './Components/Student/StudentProfile.jsx';
import EditStudentProfile from './Components/Student/EditStudentProfile.jsx';
import StudentHistory from './Components/Student/StudentHistory.jsx';
import ProtectedRouteStudent from './Components/Student/ProtectedRoute.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<App />}>
        <Route index element={<LandingPage />} />
        <Route path="Register" element={<Register />} />
        <Route path="About" element={<About />} />
        <Route path="Contact" element={<Contact />} />
      </Route>

      <Route path="Login" element={<Login />} />
      <Route path="TeacherLogin" element={<TeacherLogin />} />
      <Route path="StudentLogin" element={<StudentLogin />} />


      {/* Admin Routes */}
      <Route element={
        <ProtectedRouteAdmin>
          <AdminLayout />
        </ProtectedRouteAdmin>
      }>
        <Route path="Dashboard" element={<Dashboard />} />
        <Route path="ViewTeachers" element={<ViewTeachers />} />
        <Route path="Teachers/:id" element={<TeacherDetails />} />
        <Route path="ViewStudents" element={<ViewStudents />} />
        <Route path="StudentDetails/:id" element={<StudentDetails />} />
        <Route path="Books" element={<ViewBooks />} />
        <Route path="AddBooks" element={<AddBooks />} />
        <Route path="EditBooks/:id" element={<EditBooks />} />
        <Route path="Reports" element={<Reports />} />
      </Route>


      {/* Teacher Routes */}
      <Route element={
        <ProtectedRouteTeacher>
          <TeacherLayout />
        </ProtectedRouteTeacher>
      }>

        <Route path="TeacherDashboard" element={<TeacherDashboard />} />
        <Route path="TeacherProfile" element={<TeacherProfile />} />
        <Route path="EditTeacherProfile/:id" element={<EditTeacherProfile />} />
        <Route path="TeacherHistory" element={<TeacherHistory />} />
        <Route path="AddStudent" element={<AddStudent />} />
        <Route path="StudentsList" element={<StudentsList />} />
        <Route path="StudentInfo/:id" element={<StudentInfo />} />
      </Route>

      {/* ✅ Protected Student Routes */}
      <Route element={
        <ProtectedRouteStudent>
          <StudentLayout />
        </ProtectedRouteStudent>
      }>
        <Route path="StudentDashboard" element={<StudentDashboard />} />
        <Route path="StudentProfile" element={<StudentProfile />} />
        <Route path="EditStudentProfile/:id" element={<EditStudentProfile />} />
        <Route path="StudentHistory" element={<StudentHistory />} />
      </Route>

    </Routes>
  </Router>
);
