"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { Toast } from "@/components/admin/Toast";
import { CategoryManagerModal } from "@/components/admin/CategoryManagerModal";
import { adminFetch } from "@/components/admin/adminFetch";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  Star,
  ChevronLeft,
  ChevronRight,
  Filter,
  ImageIcon,
  Tags,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function ProductThumbnail({ product }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (product.image?.url && !imageFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.image.url}
        alt={product.name}
        className="admin-table-thumb"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div
      className="admin-table-thumb admin-table-thumb--placeholder"
      title={`${product.name} image unavailable`}
      aria-label={`${product.name} image unavailable`}
    >
      <ImageIcon size={16} style={{ color: "var(--text-muted)" }} />
    </div>
  );
}

export default function AdminProductsPage() {
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
  const [categories, setCategories] = useState([]);

  // Modals
  const [showForm, setShowForm] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await adminFetch(`${API_URL}/api/admin/categories`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load categories.");
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Category fetch error:", err);
      showToast(err.message || "Failed to load categories.", "error");
    }
  }, [showToast]);

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
      const res = await adminFetch(`${API_URL}/api/admin/products?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProducts(data.products);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [page, search, category, statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSuccess = (product, action) => {
    fetchProducts();
    showToast(`Product "${product.name}" ${action} successfully.`);
  };

  const handleCategoriesChanged = async (removedCategory) => {
    await fetchCategories();
    if (removedCategory && category === removedCategory) {
      setCategory("All");
      setPage(1);
      return;
    }
    if (removedCategory) fetchProducts();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteProduct) return;
    setDeleting(true);
    try {
      const res = await adminFetch(`${API_URL}/api/admin/products/${deleteProduct._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast(`Product deleted successfully.`);
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
        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Page header */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Products</h1>
            <p className="admin-page-subtitle">
              {total} product{total !== 1 ? "s" : ""} total
            </p>
          </div>
          <div className="admin-header-actions">
            <button
              className="admin-btn admin-btn--ghost"
              onClick={() => setShowCategories(true)}
            >
              <Tags size={17} />
              Manage Categories
            </button>
            <button
              id="add-product-btn"
              className="admin-btn admin-btn--primary"
              onClick={() => { setEditProduct(null); setShowForm(true); }}
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-filters">
          <div className="admin-search-wrapper">
            <Search size={16} className="admin-search-icon" />
            <input
              id="product-search"
              type="text"
              placeholder="Search by name, SKU, brand…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-search-input"
            />
          </div>
          <div className="admin-filter-row">
            <div className="admin-filter-group">
              <Filter size={14} style={{ color: "var(--text-muted)" }} />
              <select
                id="filter-category"
                className="admin-select"
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              >
                {["All", ...categories.map((item) => item.name)].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="admin-filter-group">
              <select
                id="filter-status"
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

        {/* Error */}
        {error && (
          <div className="admin-alert admin-alert--error" style={{ marginBottom: 16 }}>
            <span>{error}</span>
            <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={fetchProducts}>
              Retry
            </button>
          </div>
        )}

        {/* Products table */}
        {loading ? (
          <div className="admin-table-skeleton">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 60, borderRadius: 8 }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="admin-empty">
            <Package size={48} style={{ color: "var(--text-muted)", marginBottom: 16 }} />
            <p style={{ fontWeight: 600, marginBottom: 4 }}>No products found</p>
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
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <ProductThumbnail product={p} />
                      </td>
                      <td>
                        <span className="admin-table-product-name">{p.name}</span>
                      </td>
                      <td>
                        <span className="admin-table-mono">{p.sku}</span>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge--category">{p.category}</span>
                      </td>
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
                      <td>
                        <div className="admin-actions">
                          <button
                            className="admin-action-btn admin-action-btn--edit"
                            onClick={() => { setEditProduct(p); setShowForm(true); }}
                            title="Edit product"
                            aria-label={`Edit ${p.name}`}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="admin-action-btn admin-action-btn--delete"
                            onClick={() => setDeleteProduct(p)}
                            title="Delete product"
                            aria-label={`Delete ${p.name}`}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="admin-pagination">
                <button
                  className="admin-page-btn"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  aria-label="Previous page"
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
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <ProductFormModal
          product={editProduct}
          categories={categories}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
          onSuccess={handleSuccess}
        />
      )}

      {showCategories && (
        <CategoryManagerModal
          categories={categories}
          onClose={() => setShowCategories(false)}
          onChanged={handleCategoriesChanged}
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
