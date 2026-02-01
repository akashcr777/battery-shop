import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          🔋 Pilot Battery Shop
        </Link>
        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
        <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
          {user ? (
            <>
              <Link to="/inventory" className="nav-link" onClick={() => setMenuOpen(false)}>
                Inventory
              </Link>
              <Link to="/cart" className="nav-link" onClick={() => setMenuOpen(false)}>
                Cart
              </Link>
              <Link to="/orders" className="nav-link" onClick={() => setMenuOpen(false)}>
                My Orders
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
              <span className="nav-user">Hi, {user.name}</span>
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
              <Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

