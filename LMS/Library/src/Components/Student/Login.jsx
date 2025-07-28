import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/AdminLogin.css';
import logo from '../../assets/logo.jpg';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

function StudentLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post('http://localhost:5001/loginStudent', {
      email,
      password,
    });

    console.log(response.data);

    const student = response?.data?.data;
    
    if (!student || !student._id) {
      throw new Error("Invalid student data from server.");
    }

    localStorage.setItem("student", JSON.stringify(student));
    localStorage.setItem("studentId", student._id);

    toast.success("Login successful!");
    setTimeout(() => {
      navigate("/StudentDashboard");
    }, 2000);
  } catch (err) {
    console.error(err);
    setError("Invalid email or password");
    toast.error("Invalid email or password");
  }
};


  return (
    <>
      <ToastContainer />
      <div className='container adminPage py-5 mt-5'>
        <div className='row align-items-center'>
          <div className='col-lg-7'>
            <img src={logo} alt="Logo" className="img-fluid logoImage" />
          </div>

          <div className='col-lg-5'>
            <div className='adminLoginBox rounded shadow pt-5'>
              <div className='adminFormBox w-75 mx-auto'>
                <div className='adminTitle mb-4 mt-5'>
                  <h2>Student Login</h2>
                </div>

                <form onSubmit={handleLogin}>
                  <input
                    type='email'
                    name='email'
                    className="form-control mb-4 w-75 mx-auto"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder='Email'
                  />

                  <input
                    type='password'
                    name='password'
                    className="form-control mb-4 w-75 mx-auto"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder='Password'
                  />

                  {error && <div className="text-danger mb-2 text-center">{error}</div>}

                  <div align='center'>
                    <button type='submit' className='btn adminBtn mt-2'>Login</button>
                  </div>
                </form>

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default StudentLogin;
