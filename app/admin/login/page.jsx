"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { Loader2, Eye, EyeOff, AlertCircle, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const { login, admin, loading: authLoading } = useAdminAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && admin) router.replace("/admin/dashboard");
  }, [admin, authLoading, router]);

  if (authLoading || admin) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-bg" />
        <div className="admin-login-card" role="status" aria-live="polite">
          <div className="admin-login-icon">
            <Loader2 size={24} className="admin-spin" style={{ color: "var(--logo-red)" }} />
          </div>
          <p className="admin-login-subtitle">
            {admin ? "Opening your dashboard…" : "Checking admin session…"}
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Background */}
      <div className="admin-login-bg" />

      <div className="admin-login-card">
        {/* Header */}
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <Shield size={28} style={{ color: "var(--logo-red)" }} />
          </div>
          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-subtitle">AudioTechServices Management</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
          {error && (
            <div className="admin-alert admin-alert--error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              className="admin-input"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@audiotechservices.com"
              disabled={loading}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="login-password">Password</label>
            <div className="admin-input-wrapper">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="admin-input admin-input--with-icon"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="admin-btn admin-btn--primary admin-btn--full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="admin-spin" />
                Authenticating…
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="admin-login-footer">
          Protected area — authorized personnel only
        </p>
      </div>
    </div>
  );
}
