"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "./adminFetch";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check session on mount
  const checkAuth = useCallback(async () => {
    try {
      const res = await adminFetch(`${API_URL}/api/auth/me`);
      if (res.ok) {
        const data = await res.json();
        setAdmin(data.admin);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    if (data.token) {
      localStorage.setItem("adminToken", data.token);
    }
    setAdmin(data.admin);
    return data;
  };

  const logout = async () => {
    await adminFetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
    });
    localStorage.removeItem("adminToken");
    setAdmin(null);
    router.push("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
