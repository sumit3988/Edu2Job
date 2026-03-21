import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav className="landing-nav">
      <Link to="/" className="logo">
        <span className="material-symbols-outlined">school</span>
        Edu2Job
      </Link>
      <div className="nav-links">
        <button onClick={toggleTheme} className="theme-toggle-nav-btn" title="Toggle Theme">
          <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
        </button>
        <Link to="/login" className="nav-btn nav-btn-outline">Log In</Link>
        <Link to="/signup" className="nav-btn nav-btn-primary">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;