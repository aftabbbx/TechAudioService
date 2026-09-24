"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Package, CheckCircle, XCircle, Star, TrendingUp, ArrowRight } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/admin/products?limit=5`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecentProducts(data.products);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = stats
    ? [
        { label: "Total Products", value: stats.total, icon: Package, color: "var(--primary)" },
        { label: "Active", value: stats.active, icon: CheckCircle, color: "#22C55E" },
        { label: "Inactive", value: stats.inactive, icon: XCircle, color: "var(--accent)" },
        { label: "Featured", value: stats.featured, icon: Star, color: "#F59E0B" },
      ]
    : [];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        {/* Page header */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Dashboard</h1>
            <p className="admin-page-subtitle">Overview of your product catalogue</p>
          </div>
          <Link href="/admin/products" className="admin-btn admin-btn--primary" id="dashboard-manage-btn">
            <TrendingUp size={16} />
            Manage Products
          </Link>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="admin-stats-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="admin-stat-card skeleton" style={{ height: 120 }} />
            ))}
          </div>
        ) : (
          <div className="admin-stats-grid">
            {statCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="admin-stat-card">
                <div className="admin-stat-icon" style={{ background: `${color}18` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <div>
                  <p className="admin-stat-value">{value}</p>
                  <p className="admin-stat-label">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Products */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Recent Products</h2>
            <Link href="/admin/products" className="admin-link" id="dashboard-view-all">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="admin-table-skeleton">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton" style={{ height: 52, borderRadius: 8 }} />
              ))}
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="admin-empty">
              <Package size={40} style={{ color: "var(--text-muted)", marginBottom: 12 }} />
              <p>No products yet.</p>
              <Link href="/admin/products" className="admin-btn admin-btn--primary" style={{ marginTop: 12 }}>
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Featured</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className="admin-table-product">
                          {p.image?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.image.url} alt={p.name} className="admin-table-thumb" />
                          ) : (
                            <div className="admin-table-thumb admin-table-thumb--placeholder">
                              <Package size={16} style={{ color: "var(--text-muted)" }} />
                            </div>
                          )}
                          <span className="admin-table-product-name">{p.name}</span>
                        </div>
                      </td>
                      <td><span className="admin-badge admin-badge--category">{p.category}</span></td>
                      <td>₹{Number(p.price).toLocaleString("en-IN")}</td>
                      <td>
                        <span className={`admin-badge admin-badge--${p.status}`}>
                          {p.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        {p.featured ? (
                          <Star size={16} style={{ color: "#F59E0B" }} fill="#F59E0B" />
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
