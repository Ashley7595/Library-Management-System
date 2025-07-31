import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/AdminLogin.css';
import logo from '../../assets/logo.jpg';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from '../Common/NavBar'

function Login() {
  const navigate = useNavigate();


  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (admin && admin._id) {
      navigate('/Dashboard');
    }
  }, [navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const adminEmail = "Ashley@gmail.com";
  const adminPassword = "Ashley123";

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem('admin', JSON.stringify({ _id: 'admin123', email: adminEmail }));
      toast.success("Login Successfully");

      setTimeout(() => {
        navigate('/Dashboard');
      }, 2000);
    } else {
      setError("Invalid Username or Password");
      toast.error("Invalid Username or Password");
    }
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className='container adminPage py-5 mt-3'>
        <div className='row align-items-center'>
          <div className='col-lg-7'>
            <img src={logo} alt="Logo" className="img-fluid logoImage" />
          </div>
          <div className='col-lg-5'>
            <div className='adminLoginBox rounded shadow pt-5'>
              <div className='adminFormBox w-75 mx-auto'>
                <div className='adminTitle mb-4 mt-5'>
                  <h2>Admin Login</h2>
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

export default Login;
