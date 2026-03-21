import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getUser, apiGet } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getUser();

  const [resumeStatus, setResumeStatus] = useState('Pending');
  const [predictions, setPredictions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadDashboardData = async () => {
      try {
        const profileRes = await apiGet('/profile/me');
        if (profileRes?.user?.resume_path) setResumeStatus('Uploaded');
      } catch {}

      let preds = JSON.parse(localStorage.getItem('edu2job_predictions') || '[]');
      try {
        const predRes = await apiGet('/profile/predictions');
        if (predRes?.predictions?.length > 0) {
          preds = predRes.predictions;
        }
      } catch {}
      setPredictions(preds);

      try {
        const quizRes = await apiGet('/quiz/scores');
        if (quizRes?.scores?.length > 0) setQuizzes(quizRes.scores);
      } catch {}
    };

    loadDashboardData();
  }, []);

  const staggerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const cardVars = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200 } }
  };
  const listVars = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring' } }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="dashboard" />

      <div className="main-content">
        <header className="main-header">
          <h2>Dashboard</h2>
          <div className="header-actions">
            <button className="notification-btn dark-btn">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="header-avatar">
              {user?.full_name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>

        <div className="page-content content-max-1400">
          <motion.div className="dashboard-hero-epic" initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}}>
            <div className="hero-glow-bg"></div>
            <div className="hero-content">
              <h1>Welcome back, <span className="highlight-text">{user?.full_name?.split(' ')[0] || 'User'}</span></h1>
              <p>Your AI-powered career matrix is fully synchronized and ready.</p>
            </div>
            <div className="hero-buttons">
              <button className="btn btn-epic-primary" onClick={() => navigate('/prediction')}>
                <span className="material-symbols-outlined">explore</span> Start Prediction
              </button>
              <button className="btn btn-epic-glass" onClick={() => navigate('/interview')}>
                <span className="material-symbols-outlined">psychology</span> Take Mock Test
              </button>
            </div>
          </motion.div>

          <motion.div className="stats-grid-epic" variants={staggerVars} initial="hidden" animate="visible">
            <motion.div className="stat-card-epic" variants={cardVars} whileHover={{y:-5, scale:1.02}}>
              <div className="stat-glow blue-glow"></div>
              <span className="material-symbols-outlined icon">radar</span>
              <p>Total Prediction</p>
              <h2>{predictions.length}</h2>
            </motion.div>

            <motion.div className="stat-card-epic" variants={cardVars} whileHover={{y:-5, scale:1.02}}>
              <div className="stat-glow purple-glow"></div>
              <span className="material-symbols-outlined icon">military_tech</span>
              <p>Most Likely Career Role</p>
              <h2>
                {predictions.length > 0
                  ? predictions[predictions.length - 1].role
                  : 'Awaiting Data'}
              </h2>
            </motion.div>

            <motion.div className="stat-card-epic" variants={cardVars} whileHover={{y:-5, scale:1.02}}>
              <div className="stat-glow green-glow"></div>
              <span className="material-symbols-outlined icon">fingerprint</span>
              <p>Resume Status</p>
              <h2 className={resumeStatus === 'Uploaded' ? 'success-text' : 'pending-text'}>
                {resumeStatus === 'Uploaded' ? 'Verified' : 'Incomplete'}
              </h2>
            </motion.div>
          </motion.div>

          <div className="dashboard-grid-layout">
            <motion.div className="section-epic" variants={staggerVars} initial="hidden" animate="visible">
              <h3><span className="material-symbols-outlined section-icon">history</span> Recent Predictions</h3>
              {predictions.length === 0 ? (
                <div className="empty-state-epic"><span className="material-symbols-outlined">satellite_alt</span><p>No simulations run yet.</p></div>
              ) : (
                predictions.slice(-4).reverse().map((p, i) => (
                  <motion.div className="result-epic" key={i} variants={listVars} whileHover={{x: 5}}>
                    <div className="left">
                      <div className="icon-box"><span className="material-symbols-outlined">work</span></div>
                      <div>
                        <h4>{p.role}</h4>
                        <p>{p.date}</p>
                      </div>
                    </div>
                    <div className="right">
                      <div className="progress-epic">
                        <div className="progress-fill-epic fill-purple" style={{ width: `${p.confidence}%` }}></div>
                      </div>
                      <span className="pct">{p.confidence}%</span>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>

            <motion.div className="section-epic" variants={staggerVars} initial="hidden" animate="visible">
              <h3><span className="material-symbols-outlined section-icon">analytics</span> Recent Completed Courses</h3>
              {quizzes.length === 0 ? (
                <div className="empty-state-epic"><span className="material-symbols-outlined">psychology_alt</span><p>No courses completed yet.</p></div>
              ) : (
                quizzes.slice(-4).reverse().map((q, i) => (
                  <motion.div className="result-epic" key={i} variants={listVars} whileHover={{x: 5}}>
                    <div className="left">
                      <div className="icon-box green-box"><span className="material-symbols-outlined">quiz</span></div>
                      <div>
                        <h4>{q.subject}</h4>
                        <p>{q.date}</p>
                      </div>
                    </div>
                    <div className="right">
                      <div className="progress-epic">
                        <div className="progress-fill-epic fill-green" style={{ width: `${(q.score / 15) * 100}%` }}></div>
                      </div>
                      <span className="pct">{q.score}/15</span>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;