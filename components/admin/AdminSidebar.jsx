"use client";

import { useAdminAuth } from "./AdminAuthProvider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Film,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/cinema", label: "Cinema", icon: Film },
];

export function AdminSidebar() {
  const { admin, logout } = useAdminAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle — only visible below lg */}
      <button
        className="admin-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open admin menu"
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${mobileOpen ? "admin-sidebar--open" : ""}`}
        aria-label="Admin navigation"
      >
        {/* Logo */}
        <div className="admin-sidebar-logo">
          <div className="admin-logo-mark">
            <span style={{ color: "var(--logo-blue)" }}>A</span>
            <span style={{ color: "var(--logo-red)" }}>T</span>
            <span style={{ color: "var(--logo-gray)" }}>S</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="admin-logo-title">Admin Panel</p>
            <p className="admin-logo-sub">AudioTechServices</p>
          </div>
          <button
            className="admin-sidebar-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section label */}
        <div style={{ padding: "12px 20px 4px", color: "var(--text-muted)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Navigation
        </div>

        {/* Nav */}
        <nav className="admin-nav">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`admin-nav-item ${isActive ? "admin-nav-item--active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} />
                <span>{label}</span>
                {isActive && <ChevronRight size={14} className="admin-nav-arrow" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-admin-info">
            <div className="admin-avatar">
              {admin?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div style={{ minWidth: 0 }}>
              <p className="admin-admin-name">{admin?.name || "Admin"}</p>
              <p className="admin-admin-email">{admin?.email}</p>
            </div>
          </div>
          <button
            className="admin-logout-btn"
            onClick={logout}
            id="admin-logout-btn"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
