import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css";

const UploadVideo = () => {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // For dynamic alert type (success or danger)
  const navigate = useNavigate(); // Initialize navigate

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from local storage
    localStorage.removeItem('role'); // Clear role from local storage
    navigate('/'); // Redirect to login page
  };

  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video || !title || !hashtags) {
      setMessage('All fields are required!');
      setAlertType('danger');
      return;
    }

    const formData = new FormData();
    formData.append('video', video);
    formData.append('title', title);
    formData.append('hashtags', hashtags);

    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      await axios.post('http://localhost:5000/api/videos/uploadBlob', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Video uploaded successfully!');
      setAlertType('success');
      setVideo(null);
      setTitle('');
      setHashtags('');
    } catch (error) {
      setMessage('Error uploading video. Please try again.');
      setAlertType('danger');
    }
  };

  return (
    <div className="container mt-5">
      {/* Logout Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Upload Video</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Bootstrap Alert */}
      {message && (
        <div className={`alert alert-${alertType} text-center`} role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-white">
        <div className="mb-3">
          <label htmlFor="video" className="form-label">
            Video File:
          </label>
          <input
            type="file"
            id="video"
            className="form-control"
            accept="video/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title:
          </label>
          <input
            type="text"
            id="title"
            className="form-control"
            placeholder="Enter video title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="hashtags" className="form-label">
            Hashtags (comma-separated):
          </label>
          <input
            type="text"
            id="hashtags"
            className="form-control"
            placeholder="Enter hashtags (e.g., coding,react,frontend)"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Upload Video
        </button>
      </form>
    </div>
  );
};

export default UploadVideo;
