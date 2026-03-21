import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../utils/api';
import './Interview.css';

const Interview = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getUser()) navigate('/login');
  }, []);

  return (
    <div className="app-layout">
      <Sidebar activePage="interview" variant="dark" />

      <div className="main-content">
        <header className="main-header">
          <h2>Interview Prep</h2>
          <div className="header-actions">
            <button className="notification-btn">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="header-avatar" id="headerAvatar"></div>
          </div>
        </header>

        <div className="page-content">
          <div className="form-card">
            <h3 style={{ marginBottom: '8px' }}>Mock Tests</h3>
            <p className="text-secondary" style={{ marginBottom: '24px' }}>
              Test your knowledge with our subject-specific mock tests. Scores are recorded in your profile.
            </p>
            
            <div className="test-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginTop: '24px'
            }}>
              <div className="test-card" style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                transition: 'var(--transition)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div className="test-icon" style={{
                  width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--primary)' }}>code</span>
                </div>
                <h3 className="test-title" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-900)', marginBottom: '8px' }}>Java</h3>
                <p className="test-desc" style={{ fontSize: '0.95rem', color: 'var(--text-500)', marginBottom: '24px', lineHeight: 1.5 }}>
                  15 questions covering Core Java, OOPs concepts, exceptions, and memory management.
                </p>
                <Link to="/quiz?subject=java" className="btn btn-primary btn-full">Start Java Test</Link>
              </div>
              
              <div className="test-card" style={{
                   background: 'var(--surface)',
                   border: '1px solid var(--border)',
                   borderRadius: '16px',
                   padding: '32px',
                   textAlign: 'center',
                   transition: 'var(--transition)',
                   display: 'flex',
                   flexDirection: 'column',
                   alignItems: 'center'
                 }}>
                <div className="test-icon" style={{
                  width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--primary)' }}>account_tree</span>
                </div>
                <h3 className="test-title" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-900)', marginBottom: '8px' }}>Data Structures (DSA)</h3>
                <p className="test-desc" style={{ fontSize: '0.95rem', color: 'var(--text-500)', marginBottom: '24px', lineHeight: 1.5 }}>
                  15 questions on arrays, linked lists, stacks, queues, trees, and time complexity.
                </p>
                <Link to="/quiz?subject=dsa" className="btn btn-primary btn-full">Start DSA Test</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
