import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Search from './components/Search';
import VideoPlayer from './components/VideoPlayer';
import UploadVideo from './components/UploadVideo';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/search" element={<Search />} />
      <Route path="/videos/:id" element={<VideoPlayer />} />
      <Route path="/upload" element={<UploadVideo />} />
    </Routes>
  </Router>
);

export default App;
