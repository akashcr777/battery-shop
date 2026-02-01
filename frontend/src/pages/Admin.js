import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import "./Admin.css";

const Admin = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPurchases, setUserPurchases] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin-login");
      return;
    }
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [user, navigate, statusFilter]);

  const fetchData = async () => {
    try {
      if (activeTab === "orders") {
        const params = statusFilter !== "all" ? { status: statusFilter } : {};
        const response = await api.get("/admin/orders", { params });
        setOrders(response.data);
      } else if (activeTab === "users") {
        const response = await api.get("/admin/users");
        setUsers(response.data);
      } else if (activeTab === "stats") {
        const response = await api.get("/admin/stats");
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 403) {
        logout();
        navigate("/admin-login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, statusFilter]);

  const fetchUserPurchases = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}/purchases`);
      setUserPurchases(response.data);
      setSelectedUser(userId);
    } catch (error) {
      console.error("Error fetching user purchases:", error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchData();
      setSelectedOrder(null);
      alert(`Order status updated to: ${status.replace("-", " ")}`);
    } catch (error) {
      alert("Error updating order status: " + (error.response?.data?.message || error.message));
    }
  };

  const updateDriverLocation = async (orderId) => {
    if (!navigator.geolocation) {
      alert("Location is not supported by your browser.");
      return;
    }
    const isSecureContext = window.isSecureContext || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (!isSecureContext) {
      alert("Location works only on https:// or http://localhost. You're using " + window.location.origin + ". Use the site at http://localhost:3000/admin or enable HTTPS.");
      return;
    }
    const options = { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 };
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await api.put(`/orders/${orderId}/location`, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          fetchData();
          alert("Driver location updated. Customer can see it in real-time.");
        } catch (error) {
          const msg = error.response?.data?.message || error.message;
          const status = error.response?.status;
          if (status === 404) {
            alert("404 Not found. Make sure the backend server is running and restarted (so it has the location route). Error: " + msg);
          } else {
            alert("Error: " + msg);
          }
        }
      },
      (err) => {
        let msg = "Could not get your location.";
        if (err.code === 1) msg = "Location permission denied. Allow location for this site and try again.";
        else if (err.code === 2) msg = "Location unavailable.";
        else if (err.code === 3) msg = "Location request timed out.";
        alert(msg);
      },
      options
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ffc107",
      accepted: "#17a2b8",
      "ready-to-deliver": "#28a745",
      "out-for-delivery": "#007bff",
      delivered: "#6c757d",
      cancelled: "#dc3545",
    };
    return colors[status] || "#666";
  };

  const getStatusText = (status) => {
    const statusMessages = {
      pending: "Pending",
      accepted: "Order Processing",
      "ready-to-deliver": "Ready to Deliver",
      "out-for-delivery": "Out for Delivery",
      delivered: "Delivered Successfully",
      cancelled: "Cancelled",
    };
    return statusMessages[status] || status
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  if (loading && !stats) {
    return (
      <div className="admin-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🔐 Admin Dashboard</h1>
        <button onClick={() => { logout(); navigate("/"); }} className="logout-btn">
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          📦 Orders
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          👥 Users
        </button>
        <button
          className={activeTab === "stats" ? "active" : ""}
          onClick={() => setActiveTab("stats")}
        >
          📊 Statistics
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div>
          <div className="filter-section">
            <label>Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="accepted">Order Processing</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="delivered">Delivered Successfully</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="orders-stats">
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p>{orders.length}</p>
            </div>
            <div className="stat-card">
              <h3>Pending</h3>
              <p>{orders.filter((o) => o.status === "pending").length}</p>
            </div>
            <div className="stat-card">
              <h3>Processing</h3>
              <p>{orders.filter((o) => o.status === "accepted").length}</p>
            </div>
            <div className="stat-card">
              <h3>Out for Delivery</h3>
              <p>{orders.filter((o) => o.status === "out-for-delivery").length}</p>
            </div>
          </div>

          <div className="orders-list">
            {orders.length === 0 ? (
              <div className="no-data">No orders found</div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                      <p className="order-customer">
                        Customer: {order.customerName} | {order.customerPhone} | {order.customerEmail}
                      </p>
                      <p className="order-date">
                        Ordered: {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div
                      className="order-status"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {getStatusText(order.status)}
                    </div>
                  </div>

                  <div className="order-items">
                    <h4>Purchased Products:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span>{item.productName}</span>
                        <span>
                          {item.quantity} x ₹{item.price} = ₹
                          {item.quantity * item.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <strong>Total: ₹{order.totalAmount}</strong>
                    </div>
                    {order.deliveryAddress && (
                      <div className="order-address">
                        <strong>Delivery Address:</strong>{" "}
                        {Object.values(order.deliveryAddress).filter(Boolean).join(", ")}
                      </div>
                    )}
                    {order.deliveryLocation && (
                      <div className="order-location">
                        <strong>Location:</strong>{" "}
                        <a
                          href={`https://www.google.com/maps?q=${order.deliveryLocation.latitude},${order.deliveryLocation.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on Map
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="order-actions">
                    {order.status === "pending" && (
                      <button
                        className="status-button processing-btn"
                        onClick={() => updateOrderStatus(order._id, "accepted")}
                      >
                        ⚙️ Order Processing
                      </button>
                    )}
                    {order.status === "accepted" && (
                      <button
                        className="status-button delivery-btn"
                        onClick={() => updateOrderStatus(order._id, "out-for-delivery")}
                      >
                        🚚 Order Out for Delivery
                      </button>
                    )}
                    {order.status === "out-for-delivery" && (
                      <>
                        <button
                          className="status-button location-btn"
                          onClick={() => updateDriverLocation(order._id)}
                          title="Update driver's current location (customer sees live)"
                        >
                          📍 Update driver location
                        </button>
                        <button
                          className="status-button delivered-btn"
                          onClick={() => updateOrderStatus(order._id, "delivered")}
                        >
                          ✅ Accept Delivery Successfully
                        </button>
                      </>
                    )}
                    <button
                      className="view-button"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View Details
                    </button>
                  </div>
                  {order.status === "out-for-delivery" && order.currentDeliveryLocation && (
                    <div className="order-tracking-info">
                      <strong>Driver last location:</strong>{" "}
                      <a
                        href={`https://www.google.com/maps?q=${order.currentDeliveryLocation.latitude},${order.currentDeliveryLocation.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on map
                      </a>
                      {order.currentDeliveryLocation.updatedAt && (
                        <span className="tracking-time">
                          {" "}(updated {new Date(order.currentDeliveryLocation.updatedAt).toLocaleTimeString()})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
          <div className="users-list">
            {users.length === 0 ? (
              <div className="no-data">No users found</div>
            ) : (
              users.map((user) => (
                <div key={user._id} className="user-card">
                  <div className="user-header">
                    <div>
                      <h3>{user.name}</h3>
                      <p className="user-email">{user.email}</p>
                      <p className="user-phone">{user.phone}</p>
                    </div>
                    <div className="user-stats">
                      <div className="user-stat-item">
                        <strong>Orders:</strong> {user.orderCount}
                      </div>
                      <div className="user-stat-item">
                        <strong>Total Spent:</strong> ₹{user.totalSpent}
                      </div>
                    </div>
                  </div>
                  <div className="user-info">
                    <p>
                      <strong>Registered:</strong>{" "}
                      {new Date(user.createdAt).toLocaleString()}
                    </p>
                    {user.address && (
                      <p>
                        <strong>Address:</strong>{" "}
                        {Object.values(user.address).filter(Boolean).join(", ") || "Not provided"}
                      </p>
                    )}
                  </div>
                  <button
                    className="view-purchases-btn"
                    onClick={() => fetchUserPurchases(user._id)}
                  >
                    View Purchase History
                  </button>
                </div>
              ))
            )}
          </div>

          {/* User Purchases Modal */}
          {selectedUser && (
            <div className="modal-overlay" onClick={() => { setSelectedUser(null); setUserPurchases([]); }}>
              <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
                <h2>User Purchase History</h2>
                <button className="close-button" onClick={() => { setSelectedUser(null); setUserPurchases([]); }}>
                  ✕
                </button>
                <div className="modal-body">
                  {userPurchases.length === 0 ? (
                    <p>No purchases found</p>
                  ) : (
                    userPurchases.map((order) => (
                      <div key={order._id} className="purchase-item">
                        <h4>Order #{order._id.slice(-6).toUpperCase()}</h4>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        <p><strong>Status:</strong> {getStatusText(order.status)}</p>
                        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                        <div className="purchase-items">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="purchase-item-detail">
                              {item.productName} - Qty: {item.quantity} × ₹{item.price}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === "stats" && stats && (
        <div className="stats-container">
          <div className="stats-grid">
            <div className="stat-card-large">
              <h2>Total Users</h2>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
            <div className="stat-card-large">
              <h2>Total Orders</h2>
              <p className="stat-number">{stats.totalOrders}</p>
            </div>
            <div className="stat-card-large">
              <h2>Total Revenue</h2>
              <p className="stat-number">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div className="status-breakdown">
            <h3>Orders by Status</h3>
            <div className="status-list">
              <div className="status-item">
                <span>Pending:</span>
                <strong>{stats.ordersByStatus.pending}</strong>
              </div>
              <div className="status-item">
                <span>Order Processing:</span>
                <strong>{stats.ordersByStatus.accepted}</strong>
              </div>
              <div className="status-item">
                <span>Out for Delivery:</span>
                <strong>{stats.ordersByStatus["out-for-delivery"]}</strong>
              </div>
              <div className="status-item">
                <span>Delivered Successfully:</span>
                <strong>{stats.ordersByStatus.delivered}</strong>
              </div>
              <div className="status-item">
                <span>Cancelled:</span>
                <strong>{stats.ordersByStatus.cancelled}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Order Details</h2>
            <button className="close-button" onClick={() => setSelectedOrder(null)}>
              ✕
            </button>
            <div className="modal-body">
              <p><strong>Order ID:</strong> {selectedOrder._id}</p>
              <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
              <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
              <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
              <p><strong>Status:</strong> {getStatusText(selectedOrder.status)}</p>
              <p><strong>Total:</strong> ₹{selectedOrder.totalAmount}</p>
              <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              {selectedOrder.deliveryLocation && (
                <p>
                  <strong>Location:</strong>{" "}
                  <a
                    href={`https://www.google.com/maps?q=${selectedOrder.deliveryLocation.latitude},${selectedOrder.deliveryLocation.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Google Maps
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
