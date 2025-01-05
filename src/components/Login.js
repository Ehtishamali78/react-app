import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showAlert, setShowAlert] = useState({ show: false, message: '', type: '' }); // State for showing alert
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/auth/login', credentials)
      .then(response => {
        const { token, role } = response.data;

        // Save token and role in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        // Show success alert
        setShowAlert({ show: true, message: 'Login successful! Redirecting...', type: 'success' });

        // Redirect based on role after 1 second
        setTimeout(() => {
          setShowAlert({ show: false, message: '', type: '' });
          if (role === 'creator') {
            navigate('/upload'); // Redirect to creator dashboard
          } else if (role === 'consumer') {
            navigate('/dashboard'); // Redirect to consumer dashboard
          }
        }, 1000);
      })
      .catch(error => {
        console.error('Login failed:', error.response ? error.response.data : error.message);

        // Show error alert
        setShowAlert({ show: true, message: 'Login failed. Please check your credentials.', type: 'danger' });

        // Hide alert after 2 seconds
        setTimeout(() => {
          setShowAlert({ show: false, message: '', type: '' });
        }, 2000);
      });
  };

  return (
    <div className="container mt-4">
      {/* Bootstrap Alert */}
      {showAlert.show && (
        <div className={`alert alert-${showAlert.type}`} role="alert">
          {showAlert.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="form-title">Login</h2>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control custom-input"
            placeholder="Enter your username"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control custom-input"
            placeholder="Enter your password"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 custom-button">Login</button>
      </form>

      {/* Link to Signup */}
      <div className="text-center mt-3">
        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
