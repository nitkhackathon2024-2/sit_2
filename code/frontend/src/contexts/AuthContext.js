import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      delete api.defaults.headers.common["x-auth-token"];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await api.get("/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      api.defaults.headers.common["x-auth-token"] = res.data.token;
      await fetchUser();
      return true;
    } catch (error) {
      console.error("Login error", error);
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      api.defaults.headers.common["x-auth-token"] = res.data.token;
      await fetchUser();
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["x-auth-token"];
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
