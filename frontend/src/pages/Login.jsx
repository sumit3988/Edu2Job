import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiPost } from '../utils/api';
import Navbar from '../components/Navbar';
import { SvgSecureLogin } from 'iblis-react-undraw';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await apiPost('/auth/login', { email, password });

      if (res.token) {
        localStorage.setItem('edu2job_token', res.token);
        localStorage.setItem('edu2job_user', JSON.stringify(res.user));
        navigate('/dashboard');
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />

      {/* Background */}
      <div className="bg-blob blob1"></div>
      <div className="bg-blob blob2"></div>

      <div className="login-container">
        <div className="login-illustration">
          <SvgSecureLogin width="100%" height="auto" primaryColor="#00f5ff" />
        </div>
        
        <div className="login-card">
          <h2>Welcome Back 👋</h2>
          <p className="subtitle">Login to your account</p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleLogin}>
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

            <button className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="bottom-text">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;