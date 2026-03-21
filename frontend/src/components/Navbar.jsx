import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="landing-nav">
      <Link to="/" className="logo">
        <span className="material-symbols-outlined">school</span>
        Edu2Job
      </Link>
      <div className="nav-links">
        <Link to="/login" className="nav-btn nav-btn-outline">Log In</Link>
        <Link to="/signup" className="nav-btn nav-btn-primary">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
