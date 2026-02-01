import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>🔋 Pilot Battery Shop</h1>
        <p className="hero-subtitle">Fast • Reliable • Doorstep Delivery</p>
        <p className="hero-description">
          Your one-stop shop for all battery and UPS needs. Quality products
          delivered right to your doorstep.
        </p>
        {user ? (
          <Link to="/inventory" className="cta-button">
            Browse Inventory
          </Link>
        ) : (
          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary">
              Get Started
            </Link>
            <Link to="/login" className="cta-button secondary">
              Login
            </Link>
          </div>
        )}
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🚚</div>
          <h3>Fast Delivery</h3>
          <p>Quick and reliable doorstep delivery service</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔋</div>
          <h3>Quality Products</h3>
          <p>Premium batteries and UPS systems</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📍</div>
          <h3>Live Tracking</h3>
          <p>Track your order in real-time</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

