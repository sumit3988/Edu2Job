import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/api';
import { motion } from 'framer-motion';
import './SkillGap.css';

const SkillGap = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!getUser()) navigate('/login');
  }, []);

  const skillGaps = [
    {
      id: 'python', name: 'Advanced Python', category: 'Core Architecture',
      icon: 'code', color: 'blue', level: 'Intermediate', target: 65,
      learning: 'Advanced Data Structures & Algorithms in Python', time: 'Est. 12 hours'
    },
    {
      id: 'ml', name: 'Machine Learning', category: 'AI Specialization',
      icon: 'psychology', color: 'purple', level: 'Beginner', target: 30,
      learning: 'Machine Learning Fundamentals & Predictive Models', time: 'Est. 24 hours'
    },
    {
      id: 'de', name: 'Data Engineering', category: 'Infrastructure',
      icon: 'storage', color: 'green', level: 'Intermediate', target: 55,
      learning: 'Building Scalable Data Pipelines with Apache Spark', time: 'Est. 18 hours'
    },
    {
      id: 'cloud', name: 'Cloud Computing', category: 'DevOps',
      icon: 'cloud', color: 'orange', level: 'Advanced', target: 85,
      learning: 'AWS Certified Machine Learning – Specialty Prep', time: 'Est. 8 hours'
    }
  ];

  const filteredGaps = skillGaps.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const staggerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const cardVars = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 } }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="skillgap" />

      <div className="main-content">
        <header className="main-header">
          <h2>Skill Gap Intelligence</h2>
          <div className="header-actions">
            <div className="search-box search-box-desktop">
              <span className="material-symbols-outlined search-icon">search</span>
              <input 
                type="text" 
                placeholder="Analyze skills..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input dark-search"
              />
            </div>
            <button className="notification-btn dark-btn">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="header-avatar" id="headerAvatar"></div>
          </div>
        </header>

        <div className="page-content content-max-1280">
          <motion.div className="skill-gap-header-epic" initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}}>
            <h3>Nodes to Improve</h3>
            <p>Target active areas for your professional growth based on your desired role as a <strong>Senior Data Scientist</strong>. Master these neural nodes to close your skill gap.</p>
          </motion.div>

          <motion.div className="skill-gap-grid-epic" variants={staggerVars} initial="hidden" animate="visible">
            {filteredGaps.map(gap => (
              <motion.div className="skill-gap-card-epic" key={gap.id} variants={cardVars} whileHover={{y: -8, scale: 1.02}}>
                <div className={`card-glow-bg glow-${gap.color}`}></div>
                
                <div className="skill-card-top">
                  <div className="skill-info-group">
                    <div className={`skill-icon-epic stat-${gap.color}`}>
                      <span className="material-symbols-outlined">{gap.icon}</span>
                    </div>
                    <div>
                      <div className="skill-name-epic">{gap.name}</div>
                      <span className="skill-cat-epic">{gap.category}</span>
                    </div>
                  </div>
                  <span className={`badge-epic badge-${gap.level.toLowerCase()}`}>{gap.level}</span>
                </div>

                <div className="proficiency-arena">
                  <div className="prof-row">
                    <span className="prof-label">Target Synchronization</span>
                    <span className="prof-value">{gap.target}%</span>
                  </div>
                  <div className="prof-track">
                    <div className={`prof-fill fill-${gap.color}`} style={{ width: `${gap.target}%` }}></div>
                  </div>
                </div>

                <div className="learning-module">
                  <p className="module-label">
                    <span className="material-symbols-outlined">menu_book</span> Recommended Module
                  </p>
                  <a href="#" onClick={e => e.preventDefault()} className="module-link">{gap.learning}</a>
                  <p className="module-time"><span className="material-symbols-outlined">schedule</span> {gap.time}</p>
                </div>
              </motion.div>
            ))}
            
            {filteredGaps.length === 0 && (
              <motion.div className="empty-universe" variants={cardVars}>
                <span className="material-symbols-outlined">satellite_alt</span>
                No nodes found matching "{searchTerm}"
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SkillGap;
