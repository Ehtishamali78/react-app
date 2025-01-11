import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignUp = () => {
  const [userData, setUserData] = useState({ username: '', password: '', role: 'consumer' });
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    if (!userData.username || !userData.password || !userData.role) {
      setErrorMessage('All fields are required.');
      return;
    }

    axios.post('https://videoapp-backend-f8bccfcvawasg0a9.northeurope-01.azurewebsites.net/api/auth/signup', userData)
      .then(response => {
        setShowAlert(true);
        setErrorMessage(''); // Clear any previous error message
        setTimeout(() => {
          setShowAlert(false);
          navigate('/'); // Redirect to login page
        }, 2000); // 2-second delay
      })
      .catch(error => {
        console.error('Sign up failed:', error.response ? error.response.data : error.message);
        setErrorMessage(error.response?.data || 'Sign up failed. Please try again.');
      });
  };

  return (
    <div className="container mt-4">
      {/* Bootstrap Alert */}
      {showAlert && (
        <div className="alert alert-success" role="alert">
          Sign up successful! Redirecting to login...
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="form-title">Sign Up</h2>
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
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            id="role"
            name="role"
            className="form-select custom-input"
            value={userData.role} // Bind value to userData.role
            onChange={handleChange}
          >
            <option value="consumer">Consumer</option>
            <option value="creator">Creator</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-100 custom-button">Sign Up</button>
      </form>
      <div className="text-center mt-3">
        <p>
          <Link to="/">Log in here</Link> if you already have an account.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
