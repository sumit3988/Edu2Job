import React from 'react';
import { Link } from 'react-router-dom';
import { getUser, logout } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';

const Sidebar = ({ activePage }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const user = getUser();
  const initials = user && user.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : '?';

  const items = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', to: '/dashboard' },
    { id: 'profile', icon: 'person', label: 'Profile & Resume', to: '/profile' },
    { id: 'prediction', icon: 'psychology', label: 'Job Prediction', to: '/prediction' },
    { id: 'skillgap', icon: 'map', label: 'Skill Gap Map', to: '/skillgap' },
    { id: 'interview', icon: 'quiz', label: 'Interview Prep', to: '/interview' },
  ];

  return (
    <aside className={`sidebar ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="sidebar-header">
        <div className="icon-box"><span className="material-symbols-outlined sidebar-icon">school</span></div>
        <div>
          <h1>Edu2Job</h1>
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

      <div className="sidebar-footer">
        <div className="nav-item theme-toggle-btn" onClick={toggleTheme}>
          <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </div>

        <Link to="#" className="nav-item user-card-nav" onClick={(e) => { e.preventDefault(); logout(); }}>
          <div className="user-avatar">{initials}</div>
          <div className="user-card-info">
             <p className="user-name">{user ? user.full_name || user.email : 'User'}</p>
             <p className="user-role">Logout</p>
          </div>
          <span className="material-symbols-outlined">logout</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
