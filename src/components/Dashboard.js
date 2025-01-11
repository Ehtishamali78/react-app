import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./style.css";
import placeholderImage from "../img/videoplayer.jpg";

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://videoapp-backend-f8bccfcvawasg0a9.northeurope-01.azurewebsites.net/api/videos/latest")
      .then((response) => {
        setVideos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
        setError("Failed to load videos. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand text-primary" to="/dashboard">
            VideoApp
          </Link>
          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/search">
                  Search
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <h2 className="text-center colorPrimary mb-4">Latest Videos</h2>

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
              videos.map((video) => (
                <div className="col-md-4 col-sm-6" key={video.id}>
                  <div className="card video-card h-100 shadow-sm">
                    <img
                      src={video.thumbnail || placeholderImage} // Use placeholder if thumbnail is missing
                      className="card-img-top"
                      alt={video.title}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{video.title}</h5>
                      <p className="card-text text-muted">
                        <strong>Hashtags:</strong>{" "}
                        {Array.isArray(video.hashtags)
                          ? video.hashtags.join(", ")
                          : "No hashtags available"}
                      </p>
                    </div>
                    <div className="card-footer text-center">
                      <Link
                        to={`/videos/${video.id}`}
                        className="btn btn-primary w-100 customBtn bgPrimary"
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
    </div>
  );
};

export default Dashboard;
