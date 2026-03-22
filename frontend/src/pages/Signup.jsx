import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiPost } from '../utils/api';
import Navbar from '../components/Navbar';
import './Signup.css';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!fullName || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const res = await apiPost('/auth/signup', {
        full_name: fullName,
        email,
        password,
      });

      if (res.user_id) {
        navigate('/login');
      } else {
        setError(res.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="signup-page">
      <Navbar />

      {/* Background blobs */}
      <div className="bg-blob blob1"></div>
      <div className="bg-blob blob2"></div>

      <div className="signup-card">
        <h2>Create Account</h2>
        <p className="subtitle">Start your career journey today</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <span className="material-symbols-outlined">person</span>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="material-symbols-outlined">mail</span>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="material-symbols-outlined">lock</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="material-symbols-outlined">lock_reset</span>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button className="signup-btn">Create Account</button>
        </form>

        <p className="bottom-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;