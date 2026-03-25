import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

import Profile from './pages/Profile';
import Prediction from './pages/Prediction';
import SkillGap from './pages/SkillGap';
import Interview from './pages/Interview';
import Quiz from './pages/Quiz';
import MockInterview from './pages/MockInterview';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Protected routes can check state within the components themselves, as implemented in Dashboard */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/skillgap" element={<SkillGap />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/mock-interview" element={<MockInterview />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
