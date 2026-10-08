import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        E-Learn
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/courses">Courses</Link>
      </div>

      <div className="nav-buttons">
        <Link to="/login" className="login-link">
          Login
        </Link>

        <Link to="/register" className="signup-btn">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
