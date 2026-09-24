"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CinemaFormModal } from "@/components/admin/CinemaFormModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { Toast } from "@/components/admin/Toast";
import { adminFetch } from "@/components/admin/adminFetch";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
  Filter,
  ImageIcon,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
const CATEGORIES = ["All", "Amplifiers", "Digital Speakers", "Subwoofers", "Speaker Management", "Surround Speakers"];

export default function AdminCinemaPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(search && { search }),
        ...(category !== "All" && { category }),
        ...(statusFilter !== "All" && { status: statusFilter }),
      });
      const res = await adminFetch(`${API_URL}/api/admin/cinema?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProducts(data.products);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message || "Failed to load cinema products.");
    } finally {
      setLoading(false);
    }
  }, [page, search, category, statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSuccess = (product, action) => {
    fetchProducts();
    showToast(`Cinema product "${product.name}" ${action} successfully.`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProduct) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`${API_URL}/api/admin/cinema/${deleteProduct._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast(`Cinema product deleted successfully.`);
      fetchProducts();
      setDeleteProduct(null);
    } catch (err) {
      showToast(err.message || "Delete failed.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Cinema Products</h1>
            <p className="admin-page-subtitle">
              {total} product{total !== 1 ? "s" : ""} total
            </p>
          </div>
          <button
            className="admin-btn admin-btn--primary"
            onClick={() => { setEditProduct(null); setShowForm(true); }}
          >
            <Plus size={18} />
            Add Cinema Product
          </button>
        </div>

        <div className="admin-filters">
          <div className="admin-search-wrapper">
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search by name, model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search-input"
            />
          </div>
          <div className="admin-filter-row">
            <div className="admin-filter-group">
              <Filter size={14} style={{ color: "var(--text-muted)" }} />
              <select
                className="admin-select"
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="admin-filter-group">
              <select
                className="admin-select"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              >
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="admin-alert admin-alert--error" style={{ marginBottom: 16 }}>
            <span>{error}</span>
            <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={fetchProducts}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="admin-table-skeleton">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 60, borderRadius: 8 }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="admin-empty">
            <Package size={48} style={{ color: "var(--text-muted)", marginBottom: 16 }} />
            <p style={{ fontWeight: 600, marginBottom: 4 }}>No cinema products found</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Try adjusting filters or add a new product.
            </p>
            <button
              className="admin-btn admin-btn--primary"
              style={{ marginTop: 16 }}
              onClick={() => { setEditProduct(null); setShowForm(true); }}
            >
              <Plus size={16} /> Add Product
            </button>
          </div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Model</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        {p.image?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image.url} alt={p.name} className="admin-table-thumb" />
                        ) : (
                          <div className="admin-table-thumb admin-table-thumb--placeholder">
                            <ImageIcon size={16} style={{ color: "var(--text-muted)" }} />
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="admin-table-product-name">{p.name}</span>
                      </td>
                      <td>
                        <span className="admin-table-mono">{p.model}</span>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge--category">{p.category}</span>
                      </td>
                      <td>
                        <span className={`admin-badge admin-badge--${p.status}`}>
                          {p.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="admin-action-btn admin-action-btn--edit"
                            onClick={() => { setEditProduct(p); setShowForm(true); }}
                            title="Edit product"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="admin-action-btn admin-action-btn--delete"
                            onClick={() => setDeleteProduct(p)}
                            title="Delete product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="admin-pagination">
                <button
                  className="admin-page-btn"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`admin-page-btn ${page === p ? "admin-page-btn--active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="admin-page-btn"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {showForm && (
        <CinemaFormModal
          product={editProduct}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
          onSuccess={handleSuccess}
        />
      )}

      {deleteProduct && (
        <DeleteConfirmModal
          product={deleteProduct}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteProduct(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
