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
      .get(`http://localhost:5000/api/videos/${id}`)
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
      .post(`http://localhost:5000/api/videos/${id}/comments`, { text: newComment })
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
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-4">
        <Link className='btn btn-secondary customBtn' to="/dashboard">Dashboard</Link>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {video ? (
        <>
          <h2 className="text-center text-primary mb-4">{video.title}</h2>
          {/* <video controls className="video-player mb-4" src={`http://localhost:5000${video.videoUrl}`}></video> */}
          <video controls className="video-player mb-4" src={`${video.videoUrl}`}></video>

          <div>
            <h3 className="text-secondary">Comments</h3>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="mb-2">
                  <p className="mb-0">
                    <strong>{comment.username || 'Anonymous'} : </strong> {comment.text}
                  </p>
                  {/* <p></p> */}
                </div>
              ))
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}

            <div className="input-group mt-3">
              <input
                type="text"
                className="form-control"
                placeholder="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleCommentSubmit}>
                Submit
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default VideoPlayer;
