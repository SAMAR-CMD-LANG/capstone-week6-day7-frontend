"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const data = await api("/auth/me");

      setUser(data.user || null);
    } catch (err) {
      console.log("Failed to fetch user:", err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // Expose fetchUser for manual refresh
  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  async function login(email, password) {
    try {
      const data = await api("/auth/login", "POST", { email, password });
      if (data.user) {
        setUser(data.user);
        setLoading(false);
      }
      return data;
    } catch (err) {
      console.error("Login error:", err);
      throw new Error(err.message || "Login failed");
    }
  }

  async function register(name, email, password) {
    try {
      const data = await api("/auth/register", "POST", { name, email, password });
      if (data.user) {
        setUser(data.user);
        setLoading(false);
      }
      return data;
    } catch (err) {
      console.error("Register error:", err);
      throw new Error(err.message || "Registration failed");
    }
  }

  async function logout() {
    try {
      await api("/auth/logout", "POST");
      setUser(null);
    } catch (err) {
      console.log("Logout failed", err.message);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

