import React from 'react';
import { Link } from 'react-router-dom';
import { getUser, logout } from '../utils/api';
import './Sidebar.css';

const Sidebar = ({ activePage, variant }) => {
  const isDark = variant === 'dark';
  const user = getUser();
  const initials = user && user.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : '?';

  const items = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', to: '/dashboard' },
    { id: 'profile', icon: 'person', label: 'Profile & Resume', to: '/profile' },
    { id: 'prediction', icon: isDark ? 'psychology' : 'analytics', label: isDark ? 'Job Prediction' : 'Prediction', to: '/prediction' },
    { id: 'skillgap', icon: isDark ? 'map' : 'troubleshoot', label: isDark ? 'Skill Gap Map' : 'Skill Gap', to: '/skillgap' },
    { id: 'interview', icon: 'quiz', label: 'Interview Prep', to: '/interview' },
  ];

  return (
    <aside className={`sidebar ${isDark ? 'dark' : 'light'}`}>
      <div className="sidebar-header">
        <div className="icon-box"><span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>school</span></div>
        <div>
          <h1>Edu2Job</h1>
          {!isDark && <p className="sub-text">Career Platform</p>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map(item => (
          <Link key={item.id} to={item.to} className={`nav-item ${activePage === item.id ? 'active' : ''}`}>
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {isDark ? (
        <div className="sidebar-footer">
          <Link to="#" className="nav-item" onClick={(e) => { e.preventDefault(); logout(); }}>
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </Link>
        </div>
      ) : (
        <div className="sidebar-footer">
          <div className="user-card" onClick={logout} style={{ cursor: 'pointer' }}>
            <div className="user-avatar">{initials}</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p className="user-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user ? user.full_name || user.email : 'User'}
              </p>
              <p className="user-role">{user && user.degree ? user.degree : 'Student'}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
