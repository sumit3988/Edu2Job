import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/api';
import './SkillGap.css';

const SkillGap = () => {
  console.log("🔥 SkillGap Page Loaded");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!getUser()) navigate('/login');
  }, []);

  const skillGaps = [
    {
      id: 'python',
      name: 'Python',
      category: 'Core Requirement',
      icon: 'code',
      color: 'blue',
      level: 'Intermediate',
      target: 65,
      learning: 'Advanced Data Structures & Algorithms in Python',
      time: 'Est. 12 hours'
    },
    {
      id: 'ml',
      name: 'Machine Learning',
      category: 'Core Requirement',
      icon: 'psychology',
      color: 'purple',
      level: 'Beginner',
      target: 30,
      learning: 'Machine Learning Fundamentals & Predictive Models',
      time: 'Est. 24 hours'
    },
    {
      id: 'de',
      name: 'Data Engineering',
      category: 'Bonus Skill',
      icon: 'storage',
      color: 'green',
      level: 'Intermediate',
      target: 55,
      learning: 'Building Scalable Data Pipelines with Apache Spark',
      time: 'Est. 18 hours'
    },
    {
      id: 'cloud',
      name: 'Cloud Computing',
      category: 'Industry Standard',
      icon: 'cloud',
      color: 'orange',
      level: 'Advanced',
      target: 85,
      learning: 'AWS Certified Machine Learning – Specialty Prep',
      time: 'Est. 8 hours'
    }
  ];

  const filteredGaps = skillGaps.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Sidebar activePage="skillgap" variant="light" />

      <div className="main-content">
        <header className="main-header">
          <h2>Skill Gap Analysis</h2>
          <div className="header-actions">
            <div className="search-box" style={{ position: 'relative', display: window.innerWidth >= 768 ? 'block' : 'none' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-400)', fontSize: '1rem' }}>search</span>
              <input 
                type="text" 
                placeholder="Search skills..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  padding: '8px 16px 8px 36px', 
                  background: '#f1f5f9', 
                  border: '1px solid transparent', 
                  borderRadius: 'var(--radius)', 
                  fontSize: '0.875rem', 
                  width: '256px', 
                  outline: 'none', 
                  fontFamily: 'var(--font)'
                }} 
              />
            </div>
            <button className="notification-btn">
              <span className="material-symbols-outlined">notifications</span>
              <span className="notification-dot" style={{ background: 'var(--red-500)' }}></span>
            </button>
          </div>
        </header>

        <div className="page-content" style={{ maxWidth: '1100px' }}>
          <div className="skill-gap-header">
            <h3>Skills to Improve</h3>
            <p>We've identified key areas for your professional growth based on your desired role as a Senior Data Scientist. Master these skills to close your gap.</p>
          </div>

          <div className="skill-gap-grid">
            {filteredGaps.map(gap => (
              <div className="skill-gap-card" key={gap.id}>
                <div className="skill-gap-card-header">
                  <div className="skill-gap-card-info">
                    <div className={`skill-gap-icon ${gap.color}`}><span className="material-symbols-outlined">{gap.icon}</span></div>
                    <div>
                      <div className="skill-gap-name">{gap.name}</div>
                      <span className="skill-gap-cat">{gap.category}</span>
                    </div>
                  </div>
                  <span className={`level-badge level-${gap.level.toLowerCase()}`}>{gap.level}</span>
                </div>
                <div className="proficiency-section">
                  <div className="proficiency-row">
                    <span className="proficiency-label">Target Proficiency</span>
                    <span className="proficiency-value">{gap.target}%</span>
                  </div>
                  <div className="proficiency-bar"><div className="proficiency-fill" style={{ width: `${gap.target}%`, transition: 'width 1s ease-out' }}></div></div>
                </div>
                <div className="learning-box">
                  <p className="learning-label"><span className="material-symbols-outlined">menu_book</span> Recommended Learning</p>
                  <a href="#" onClick={e => e.preventDefault()} className="learning-link">{gap.learning}</a>
                  <p className="learning-time"><span className="material-symbols-outlined">schedule</span> {gap.time}</p>
                </div>
              </div>
            ))}
            
            {filteredGaps.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-500)', gridColumn: '1 / -1' }}>
                No skills found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGap;
