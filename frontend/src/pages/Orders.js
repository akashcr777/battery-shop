import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import "./Orders.css";

const TRACK_STATUSES = ["accepted", "ready-to-deliver", "out-for-delivery"];

const Orders = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [cancellationCount, setCancellationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [trackOrderId, setTrackOrderId] = useState(null);
  const [trackOrder, setTrackOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await api.get("/orders/my-orders");
      setOrders(response.data.orders || response.data);
      setCancellationCount(response.data.cancellationCount || 0);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Wait for auth to load before checking role
    if (authLoading) {
      return;
    }
    
    // Ensure only regular users (non-admin) can access this page
    if (user && user.role === "admin") {
      navigate("/admin");
      return;
    }
    
    // Only fetch orders if user is not an admin
    if (user && user.role !== "admin") {
      fetchOrders();
      // Auto-refresh every 5 seconds to get latest status updates
      const interval = setInterval(fetchOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [user, navigate, authLoading, fetchOrders]);

  const handleCancelOrder = async (orderId, orderAmount) => {
    const fineAmount = cancellationCount >= 2 ? Math.max(orderAmount * 0.05, 100) : 0;
    
    let confirmMessage = "Are you sure you want to cancel this order?";
    if (cancellationCount >= 2) {
      confirmMessage += `\n\n⚠️ WARNING: You have already cancelled ${cancellationCount} orders.\nCancelling this order will result in a fine of ₹${fineAmount.toFixed(2)}.`;
    } else if (cancellationCount === 1) {
      confirmMessage += `\n\n⚠️ Note: You have cancelled 1 order. If you cancel this order, the next cancellation will result in a fine.`;
    }

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      alert(
        response.data.fineApplied
          ? `Order cancelled. A fine of ₹${response.data.fineAmount.toFixed(2)} has been applied.`
          : "Order cancelled successfully."
      );
      fetchOrders();
    } catch (error) {
      alert("Error cancelling order: " + (error.response?.data?.message || error.message));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ffc107",
      accepted: "#17a2b8",
      "ready-to-deliver": "#28a745",
      "out-for-delivery": "#007bff",
      delivered: "#28a745",
      cancelled: "#dc3545",
    };
    return colors[status] || "#666";
  };

  const getStatusText = (status) => {
    const statusMessages = {
      pending: "⏳ Pending - Waiting for Admin Approval",
      accepted: "⚙️ Order Processing",
      "ready-to-deliver": "📦 Ready for Delivery",
      "out-for-delivery": "🚚 Delivery is Out Now",
      delivered: "✅ Delivered Successfully",
      cancelled: "❌ Cancelled",
    };
    return statusMessages[status] || status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      accepted: "⚙️",
      "ready-to-deliver": "📦",
      "out-for-delivery": "🚚",
      delivered: "✅",
      cancelled: "❌",
    };
    return icons[status] || "📋";
  };

  // Poll single order for tracking (Swiggy-like live)
  useEffect(() => {
    if (!trackOrderId || !user) return;
    const fetchTrackOrder = async () => {
      try {
        const res = await api.get(`/orders/${trackOrderId}`);
        setTrackOrder(res.data);
      } catch (e) {
        setTrackOrder(null);
      }
    };
    fetchTrackOrder();
    const interval = setInterval(fetchTrackOrder, 5000);
    return () => clearInterval(interval);
  }, [trackOrderId, user]);

  const statusSteps = [
    { key: "pending", label: "Order placed" },
    { key: "accepted", label: "Processing" },
    { key: "ready-to-deliver", label: "Ready for delivery" },
    { key: "out-for-delivery", label: "On the way" },
    { key: "delivered", label: "Delivered" },
  ];

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <h1>My Orders</h1>
        <div className="no-orders">
          <p>You have no orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div
                className="order-status"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                <span className="status-icon">{getStatusIcon(order.status)}</span>
                <span className="status-text">{getStatusText(order.status)}</span>
              </div>
            </div>

            {/* Status Update Banner */}
            {order.status === "accepted" && (
              <div className="status-banner processing-banner">
                <span className="banner-icon">⚙️</span>
                <div className="banner-content">
                  <strong>Order Processing!</strong>
                  <p>Your order is being processed. We're preparing it for delivery!</p>
                </div>
              </div>
            )}
            {order.status === "out-for-delivery" && (
              <div className="status-banner delivery-banner">
                <span className="banner-icon">🚚</span>
                <div className="banner-content">
                  <strong>Delivery is Out Now!</strong>
                  <p>Your order is out for delivery. It will reach you soon!</p>
                </div>
              </div>
            )}
            {order.status === "delivered" && (
              <div className="status-banner delivered-banner">
                <span className="banner-icon">✅</span>
                <div className="banner-content">
                  <strong>Delivered Successfully!</strong>
                  <p>Your order has been delivered successfully. Thank you for shopping with us!</p>
                </div>
              </div>
            )}

            <div className="order-items">
              <h4>Bill Items:</h4>
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="order-item-name">{item.productName}</div>
                  <div className="order-item-price">
                    {item.quantity} × ₹{item.price} = ₹{item.quantity * item.price}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="bill-summary">
                <div className="bill-row">
                  <span>Subtotal:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
                <div className="bill-row">
                  <span>Delivery Charges:</span>
                  <span>₹0</span>
                </div>
                <div className="bill-row bill-total-row">
                  <span><strong>Total Amount:</strong></span>
                  <span><strong>₹{order.totalAmount}</strong></span>
                </div>
              </div>
              <div className="billing-date">
                <strong>Billing Date:</strong>{" "}
                {new Date(order.billingDate || order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              {order.deliveryAddress && (
                <div className="order-address">
                  <strong>Delivery Address:</strong>{" "}
                  {Object.values(order.deliveryAddress).filter(Boolean).join(", ")}
                </div>
              )}
              {order.cancellationFine > 0 && (
                <div className="cancellation-fine">
                  <strong>⚠️ Cancellation Fine:</strong> ₹{order.cancellationFine.toFixed(2)}
                </div>
              )}
            </div>

            {/* Track order (Swiggy-like) */}
            {TRACK_STATUSES.includes(order.status) && (
              <div className="order-actions">
                <button
                  type="button"
                  className="track-order-btn"
                  onClick={() => setTrackOrderId(order._id)}
                >
                  📍 Track order (live)
                </button>
              </div>
            )}

            {/* Cancel Button */}
            {order.status !== "delivered" && order.status !== "cancelled" && (
              <div className="order-actions">
                <button
                  className="cancel-order-btn"
                  onClick={() => handleCancelOrder(order._id, order.totalAmount)}
                >
                  {cancellationCount >= 2 ? (
                    <>❌ Cancel Order (Fine: ₹{Math.max(order.totalAmount * 0.05, 100).toFixed(2)})</>
                  ) : (
                    <>❌ Cancel Order</>
                  )}
                </button>
                {cancellationCount > 0 && cancellationCount < 2 && (
                  <p className="cancellation-warning">
                    ⚠️ You have cancelled {cancellationCount} order(s). Next cancellation will result in a fine.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Track order modal - live updates like Swiggy */}
      {trackOrderId && (
        <div className="track-modal-overlay" onClick={() => { setTrackOrderId(null); setTrackOrder(null); }}>
          <div className="track-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="track-modal-close" onClick={() => { setTrackOrderId(null); setTrackOrder(null); }}>✕</button>
            <h2>📍 Live order tracking</h2>
            {trackOrder ? (
              <>
                <p className="track-order-id">Order #{trackOrder._id.slice(-6).toUpperCase()}</p>
                <div className="track-status-timeline">
                  {statusSteps.map((step, i) => {
                    const idx = statusSteps.findIndex((s) => s.key === trackOrder.status);
                    const done = i <= idx;
                    return (
                      <div key={step.key} className={`track-step ${done ? "done" : ""}`}>
                        <span className="track-step-dot">{done ? "✓" : i + 1}</span>
                        <span className="track-step-label">{step.label}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="track-current-status">
                  <strong>Status:</strong> {getStatusText(trackOrder.status)}
                </p>
                {trackOrder.status === "out-for-delivery" && trackOrder.currentDeliveryLocation && (
                  <div className="track-driver-location">
                    <strong>🚚 Driver&apos;s current location (updates every 5 sec):</strong>
                    <a
                      href={`https://www.google.com/maps?q=${trackOrder.currentDeliveryLocation.latitude},${trackOrder.currentDeliveryLocation.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="track-map-link"
                    >
                      View on map
                    </a>
                    {trackOrder.currentDeliveryLocation.updatedAt && (
                      <span className="track-updated">
                        Last updated: {new Date(trackOrder.currentDeliveryLocation.updatedAt).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                )}
                {trackOrder.deliveryAddress && (
                  <div className="track-delivery-address">
                    <strong>Delivery to:</strong> {Object.values(trackOrder.deliveryAddress).filter(Boolean).join(", ")}
                  </div>
                )}
              </>
            ) : (
              <p>Loading tracking info...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

