import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../utils/api';
import { motion } from 'framer-motion';
import './Interview.css';

const Interview = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getUser()) navigate('/login');
  }, []);

  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300 } }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="interview" />

      <div className="main-content">
        <header className="main-header">
          <h2>Interview Intelligence</h2>
          <div className="header-actions">
            <button className="notification-btn dark-btn">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="header-avatar" id="headerAvatar"></div>
          </div>
        </header>

        <div className="page-content">
          <motion.div initial="hidden" animate="visible" variants={containerVars}>
            <motion.h3 className="subject-title-epic" variants={itemVars}>Technical Mock Tests</motion.h3>
            <motion.p className="page-subtitle-epic" variants={itemVars}>
              Test your knowledge against adaptive, subject-specific mock tests. Scores automatically sync to your AI profile matrix.
            </motion.p>

            <motion.div className="subjects-grid-epic" variants={containerVars}>

              {/* Java */}
              <motion.div className="subject-card-epic" variants={itemVars} whileHover={{ y: -8, scale: 1.02 }}>
                <div className="subject-glow-epic"></div>
                <div className="subject-header-epic">
                  <div className="subject-icon-box-epic">
                    <span className="material-symbols-outlined">code</span>
                  </div>
                  <h3 className="subject-title-epic">Enterprise Java</h3>
                </div>
                <p className="subject-desc-epic">
                  15 adaptive questions covering Core Java, OOP architecture, concurrency, and JVM memory management.
                </p>
                <div className="subject-actions-epic">
                  <Link to="/quiz?subject=java" className="btn-start-epic">
                    Deploy Java Test
                  </Link>
                </div>
              </motion.div>

              {/* DSA */}
              <motion.div className="subject-card-epic" variants={itemVars} whileHover={{ y: -8, scale: 1.02 }}>
                <div className="subject-glow-epic" style={{ background: 'rgba(168, 85, 247, 0.3)' }}></div>
                <div className="subject-header-epic">
                  <div className="subject-icon-box-epic" style={{ color: '#A855F7', background: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                    <span className="material-symbols-outlined">account_tree</span>
                  </div>
                  <h3 className="subject-title-epic">Data Structures (DSA)</h3>
                </div>
                <p className="subject-desc-epic">
                  15 algorithm challenges on trees, graphs, dynamic programming, and Big-O time complexity optimization.
                </p>
                <div className="subject-actions-epic">
                  <Link to="/quiz?subject=dsa" className="btn-start-epic">
                    Deploy DSA Test
                  </Link>
                </div>
              </motion.div>

            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Interview;