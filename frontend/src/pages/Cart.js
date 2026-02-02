import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import "./Cart.css";

const Cart = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
    // Don't auto-fetch location - let user click button instead
  }, []);

  const isSecureContext = () => {
    // Check if geolocation is available in secure context
    // HTTPS, localhost, or 127.0.0.1 are allowed
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // HTTPS is always secure
    if (protocol === "https:") return true;
    
    // localhost and 127.0.0.1 are allowed for HTTP
    if (hostname === "localhost" || hostname === "127.0.0.1") return true;
    
    // Check browser's secure context flag
    return window.isSecureContext === true;
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported by your browser. Please enter your address manually.");
      return;
    }

    // Check if we're in a secure context
    if (!isSecureContext()) {
      const currentUrl = window.location.origin;
      const message = 
        "📍 Location access requires HTTPS or localhost.\n\n" +
        "You're accessing via: " + currentUrl + "\n\n" +
        "To use location tracking:\n" +
        "• Use https:// (recommended for production)\n" +
        "• Or access via http://localhost:3000 (for local testing)\n\n" +
        "For now, please enter your address manually in the form below.";
      alert(message);
      return;
    }

    const options = { 
      enableHighAccuracy: false, 
      timeout: 15000, 
      maximumAge: 60000 
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
        
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const a = data.address || {};
          setDeliveryAddress((prev) => ({
            ...prev,
            street: [a.house_number, a.road, a.suburb].filter(Boolean).join(", ") || prev.street,
            city: a.city || a.town || a.village || a.county || prev.city,
            state: a.state || prev.state,
            pincode: a.postcode || prev.pincode,
          }));
        } catch (e) {
          console.error("Reverse geocode failed:", e);
          // Location captured but address lookup failed - that's okay
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        let msg = "Could not get your location. Please enter address manually.";
        if (error.code === 1) {
          msg = "Location permission denied. Please allow location access or enter your address manually.";
        } else if (error.code === 2) {
          msg = "Location unavailable. Please enter your address manually.";
        } else if (error.code === 3) {
          msg = "Location request timed out. Please enter your address manually.";
        }
        alert(msg);
      },
      options
    );
  };

  const updateQuantity = (productId, change) => {
    const updatedCart = cart.map((item) => {
      if (item.productId === productId) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) return null;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const hasAddress = deliveryAddress.street?.trim() || deliveryAddress.city?.trim() || deliveryAddress.pincode?.trim();
    if (!hasAddress && !location) {
      alert("Please add your delivery address or use \"Use my location\" so we can deliver to you.");
      return;
    }

    setLoading(true);
    try {
      // Update user location
      if (location) {
        await api.put("/auth/location", location);
      }

      const orderData = {
        items: cart,
        deliveryAddress,
        deliveryLocation: location,
      };

      const response = await api.post("/orders", orderData);
      localStorage.removeItem("cart");
      setCart([]);
      alert("Order placed successfully! Order ID: " + response.data._id);
      navigate("/orders");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      alert("Error placing order: " + errorMessage);
      
      // If user not found, redirect to login
      if (error.response?.data?.code === "USER_NOT_FOUND") {
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate("/inventory")} className="shop-button">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="item-info">
                <h3>{item.productName}</h3>
                <p>₹{item.price} each</p>
              </div>
              <div className="item-controls">
                <button onClick={() => updateQuantity(item.productId, -1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, 1)}>
                  +
                </button>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.productId)}
                >
                  Remove
                </button>
              </div>
              <div className="item-total">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        <div className="checkout-section">
          <h2>Checkout</h2>
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              value={deliveryAddress.street}
              onChange={(e) =>
                setDeliveryAddress({ ...deliveryAddress, street: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={deliveryAddress.city}
              onChange={(e) =>
                setDeliveryAddress({ ...deliveryAddress, city: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              value={deliveryAddress.state}
              onChange={(e) =>
                setDeliveryAddress({ ...deliveryAddress, state: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Pincode</label>
            <input
              type="text"
              value={deliveryAddress.pincode}
              onChange={(e) =>
                setDeliveryAddress({
                  ...deliveryAddress,
                  pincode: e.target.value,
                })
              }
            />
          </div>
          <div className="location-actions">
            <button 
              type="button" 
              className="use-location-btn" 
              onClick={getLocation}
              title={!isSecureContext() ? "Location requires HTTPS or localhost. Please enter address manually." : "Click to get your current location"}
            >
              📍 Use my location
            </button>
            {location && (
              <p className="location-status">✅ Location captured • Address filled from your location</p>
            )}
            {!isSecureContext() && !location && (
              <p className="location-hint">
                💡 Tip: Location works on HTTPS or localhost. You can still place orders by entering your address manually.
              </p>
            )}
          </div>
          
          {/* Bill Breakdown */}
          <div className="bill-section">
            <h3>Bill Details</h3>
            <div className="bill-items">
              {cart.map((item) => (
                <div key={item.productId} className="bill-item">
                  <div className="bill-item-name">{item.productName}</div>
                  <div className="bill-item-details">
                    <span>Qty: {item.quantity}</span>
                    <span>× ₹{item.price}</span>
                    <span className="bill-item-total">= ₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bill-total">
              <div className="bill-total-row">
                <span>Subtotal:</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="bill-total-row">
                <span>Delivery Charges:</span>
                <span>₹0</span>
              </div>
              <div className="bill-total-row final-total">
                <span><strong>Total Amount:</strong></span>
                <span><strong>₹{totalAmount}</strong></span>
              </div>
            </div>
          </div>

          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Processing..." : "Place Order & Generate Bill"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

