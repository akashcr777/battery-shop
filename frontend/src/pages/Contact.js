import React from "react";
import "./Contact.css";

const Contact = () => {
  const shopAddress = "Ettayapuram Rd, opp. D-MART, Muthammal Colony, Thoothukudi, Tamil Nadu 628002";
  const shopPhone = "9489100871";
  const shopLocation = {
    lat: 8.8024,
    lng: 78.1456,
  }; // Thoothukudi - Ettayapuram Rd, Muthammal Colony area

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Get in touch with Pilot Battery Shop</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-card">
            <h2>📍 Shop Location</h2>
            <p>Visit us at our store</p>
            <div className="map-container">
              <iframe
                title="Shop Location"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${encodeURIComponent(shopAddress)}&output=embed`}
              ></iframe>
              <p className="map-link">
                <a
                  href={`https://www.google.com/maps?q=${encodeURIComponent(shopAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps
                </a>
              </p>
            </div>
          </div>

          <div className="info-card">
            <h2>📞 Contact Information</h2>
            <div className="contact-details">
              <div className="contact-item">
                <strong>Phone:</strong>
                <a href={`tel:${shopPhone}`}>{shopPhone}</a>
              </div>
              <div className="contact-item">
                <strong>Email:</strong>
                <a href="mailto:info@pilotbatteryshop.com">
                  info@pilotbatteryshop.com
                </a>
              </div>
              <div className="contact-item">
                <strong>Address:</strong>
                <p>{shopAddress}</p>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h2>🕒 Business Hours</h2>
            <div className="hours">
              <p><strong>Monday - Saturday:</strong> 9:00 AM - 8:00 PM</p>
              <p><strong>Sunday:</strong> 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

