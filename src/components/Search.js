import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "./style.css";
import placeholderImage from "../img/videoplayer.jpg";

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); // Tracks if the user has performed a search
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim() === "") return; // Prevent empty search
    axios
      .get(`https://videoapp-backend-f8bccfcvawasg0a9.northeurope-01.azurewebsites.net/api/videos/search?query=${query}`)
      .then(response => {
        setResults(response.data);
        setHasSearched(true); // Mark that a search has been performed
      })
      .catch(error => {
        console.error(error);
        setResults([]);
        setHasSearched(true); // Mark that a search has been performed even if there's an error
      });
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Redirect to login page
    navigate('/');
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
        <h2 className="text-center colorPrimary mb-4">Search Videos</h2>
        <div className="input-group mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title or hashtag"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary bgPrimary" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="row g-4">
          {hasSearched && results.length === 0 && (
            <div className="text-center text-muted mt-4">
              <h5>No videos available</h5>
              <p>Try searching for a different query or check back later!</p>
            </div>
          )}
          {results.length > 0 &&
            results.map((video) => (
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
            ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
