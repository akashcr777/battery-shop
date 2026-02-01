import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inventory from "./pages/Inventory";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Contact from "./pages/Contact";
import "./style.css";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  // Check user role - ensure regular users (non-admin) can access user pages
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && user.role === "admin") {
      // Admin users should use the admin page, redirect them
      return <Navigate to="/admin" />;
    }
  } catch (e) {
    // If parsing fails, still allow access (token is valid)
  }
  
  return children;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/admin-login" />;
  }
  
  // Check user role from context or localStorage
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && user.role === "admin") {
      return children;
    }
  } catch (e) {
    // If parsing fails, redirect to login
  }
  
  return <Navigate to="/admin-login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/inventory"
            element={
              <PrivateRoute>
                <Inventory />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/:category"
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
