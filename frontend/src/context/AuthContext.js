import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me");
      if (response.data && response.data._id) {
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
      } else {
        throw new Error("Invalid user data");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    setUser(response.data.user);
    return response.data;
  };

  const register = async (name, email, phone, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      phone,
      password,
    });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateLocation = async (latitude, longitude) => {
    try {
      await api.put("/auth/location", { latitude, longitude });
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateLocation,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

