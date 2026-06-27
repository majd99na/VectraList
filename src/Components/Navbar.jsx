import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaUserPlus,
  FaHome,
  FaTachometerAlt,
  FaCog,
} from "react-icons/fa";
import { BiListPlus } from "react-icons/bi";
import { useDataApi } from "../Contexts/DataAPI";
import { Button } from "react-bootstrap";

const Navbar = () => {
  const { user, logOut } = useDataApi();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/signin", label: "Sign In", icon: <FaSignInAlt /> },
    { path: "/signup", label: "Sign Up", icon: <FaUserPlus /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="custom-navbar">
      <div className="custom-nav-container">
        <Link to="/" className="custom-nav-logo">
          <BiListPlus className="custom-logo-icon" />
          <span>TodoApp</span>
        </Link>

        <button
          className="custom-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`custom-nav-links ${isMenuOpen ? "active" : ""}`}>
          <li>
            <Link
              to={"/"}
              className={`custom-nav-link ${isActive("/") ? "active" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="custom-nav-icon">{<FaHome />}</span>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              to={"/dashboard"}
              className={`custom-nav-link ${isActive("/dashboard") ? "active" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="custom-nav-icon">{<FaTachometerAlt />}</span>
              <span>Dashboard</span>
            </Link>
          </li>
          {!user ? (
            <>
              <li>
                <Link
                  to={"/signin"}
                  className={`custom-nav-link ${isActive("/signin") ? "active" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="custom-nav-icon">{<FaSignInAlt />}</span>
                  <span>Sign In</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/signup"}
                  className={`custom-nav-link ${isActive("/signup") ? "active" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="custom-nav-icon">{<FaUserPlus />}</span>
                  <span>Sign Up</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <span className="nav-user">Hello {user.username}</span>
              <Button onClick={logOut} variant="outline-danger">
                Logout
              </Button>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
