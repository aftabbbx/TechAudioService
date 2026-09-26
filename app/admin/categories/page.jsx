"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CategoryManagerModal } from "@/components/admin/CategoryManagerModal";
import { adminFetch } from "@/components/admin/adminFetch";
import { RefreshCw, Tags } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showManager, setShowManager] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminFetch(`${API_URL}/api/admin/categories`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load categories.");
      setCategories(data.categories || []);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Categories</h1>
            <p className="admin-page-subtitle">
              Manage the categories shown in product filters.
            </p>
          </div>
          <button
            className="admin-btn admin-btn--primary"
            onClick={() => setShowManager(true)}
          >
            <Tags size={17} /> Manage Categories
          </button>
        </div>

        {error ? (
          <div className="admin-alert admin-alert--error">
            <span>{error}</span>
            <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={fetchCategories}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        ) : loading ? (
          <div className="admin-table-skeleton">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton" style={{ height: 60, borderRadius: 8 }} />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="admin-empty">
            <Tags size={28} />
            <p>No categories yet.</p>
            <button className="admin-btn admin-btn--primary" onClick={() => setShowManager(true)}>
              Manage Categories
            </button>
          </div>
        ) : (
          <div className="admin-section">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Products</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.name}>
                      <td>{category.name}</td>
                      <td>{category.productCount}</td>
                      <td>{category.managed ? "Managed" : "Existing products"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showManager && (
        <CategoryManagerModal
          categories={categories}
          onClose={() => setShowManager(false)}
          onChanged={fetchCategories}
        />
      )}
    </div>
  );
}
