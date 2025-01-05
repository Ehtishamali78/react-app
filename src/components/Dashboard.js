import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import "./style.css";

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null); // Handle errors
  const [loading, setLoading] = useState(true); // Handle loading state
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/videos/latest')
      .then(response => {
        setVideos(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Redirect to login page
    navigate('/');
  };

  return (
    <div className="container mt-5">
      {/* Logout & Search Button */}
      <div className="d-flex justify-content-between mb-3">
        <Link className='btn btn-success customBtn' to="/search">Search Videos</Link>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
      <h2 className="text-center text-primary mb-4">Latest Videos</h2>

      {/* Loading spinner */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {/* Render videos */}
      {!loading && !error && (
        <div className="row g-4">
          {videos.length > 0 ? (
            videos.map(video => (
              <div className="col-md-4 col-sm-6" key={video.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{video.title}</h5>
                    <p className="card-text text-muted">
                      <strong>Hashtags:</strong>{' '}
                      {Array.isArray(video.hashtags) ? video.hashtags.join(', ') : 'No hashtags available'}
                    </p>
                  </div>
                  <div className="card-footer">
                    <Link
                      to={`/videos/${video.id}`}
                      className="btn btn-primary w-100"
                    >
                      Watch Video
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted">No videos available.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
