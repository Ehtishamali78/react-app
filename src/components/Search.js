import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "./style.css";

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    axios
      .get(`http://localhost:5000/api/videos/search?query=${query}`)
      .then(response => setResults(response.data))
      .catch(error => console.error(error));
  };  

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Redirect to login page
    navigate('/');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
        <Link className='btn btn-secondary customBtn' to="/dashboard">Dashboard</Link>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <h2 className="text-center text-primary mb-4">Search Videos</h2>
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title or hashtag"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="row g-4">
        {results.map((video) => (
          <div className="col-md-4 col-sm-6" key={video.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{video.title}</h5>
                <p className="card-text text-muted">
                  <strong>Hashtags:</strong> {video.hashtags.join(", ")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
