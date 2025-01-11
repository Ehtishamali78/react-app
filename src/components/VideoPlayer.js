import React, { useState, useEffect } from 'react';
import { useNavigate,useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VideoPlayer = () => {
  const { id } = useParams(); // Use useParams to get the video ID from the route
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://videoapp-backend-f8bccfcvawasg0a9.northeurope-01.azurewebsites.net/api/videos/${id}`)
      .then((response) => {
        setVideo(response.data.video);
        setComments(response.data.comments);
      })
      .catch((error) => {
        console.error('Error fetching video:', error);
        setError('Failed to load video. Please try again later.');
      });
  }, [id]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Redirect to login page
    navigate('/');
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    axios
      .post(`https://videoapp-backend-f8bccfcvawasg0a9.northeurope-01.azurewebsites.net/api/videos/${id}/comments`, { text: newComment })
      .then((response) => {
        setComments([...comments, response.data]); // Add new comment
        setNewComment(''); // Clear input
      })
      .catch((error) => console.error('Error adding comment:', error));
  };

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

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
      <div className="row videoplayer-container mt-5">
        {video ? (
          <>
          <div className='col-md-8'>
            <h2 className="text-center colorPrimary mb-2">{video.title}</h2>
            {/* <video controls className="video-player mb-4" src={`https://videoapp-backend-f8bccfcvawasg0a9.northeurope-01.azurewebsites.net${video.videoUrl}`}></video> */}
            <video controls className="video-player mb-4" src={`${video.videoUrl}`}></video>
          </div>
          <div className='col-md-4'>
            <div className="comments-section">
              <h3 className="text-secondary text-danger">Comments</h3>
              <div className="comments-container">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} className="comment mb-2">
                      <p className="mb-0">
                        <strong className='colorPrimary'>{comment.username || 'Anonymous'}:</strong> {comment.text}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>
          <div className='row col-md-8'>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="btn btn-primary bgPrimary" onClick={handleCommentSubmit}>
                Submit
              </button>
            </div>
          </div>
          </>
        ) : (
          <p>Loading video...</p>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
