"use client";

import { useState } from "react";
import { AlertCircle, Loader2, Plus, Trash2, X } from "lucide-react";
import { adminFetch } from "./adminFetch";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function CategoryManagerModal({ categories, onClose, onChanged }) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError("");
    try {
      const response = await adminFetch(`${API_URL}/api/admin/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not add category.");

      setName("");
      await onChanged();
    } catch (submitError) {
      setError(submitError.message || "Could not add category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (!category.id || category.productCount > 0) return;

    setDeletingId(category.id);
    setError("");
    try {
      const response = await adminFetch(`${API_URL}/api/admin/categories/${category.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not delete category.");
      await onChanged(category.name);
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="category-manager-title">
      <div className="admin-modal admin-modal--sm admin-category-modal">
        <div className="admin-modal-header">
          <div>
            <h2 id="category-manager-title" className="admin-modal-title">Manage Categories</h2>
            <p className="admin-page-subtitle">Categories power the product filters.</p>
          </div>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="admin-modal-body">
          {error && (
            <div className="admin-alert admin-alert--error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form className="admin-category-create" onSubmit={handleCreate}>
            <label className="admin-label" htmlFor="new-category-name">Add a category</label>
            <div className="admin-category-create-row">
              <input
                id="new-category-name"
                className="admin-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={80}
                placeholder="e.g. Microphones"
                required
              />
              <button className="admin-btn admin-btn--primary" type="submit" disabled={saving || !name.trim()}>
                {saving ? <Loader2 size={16} className="admin-spin" /> : <Plus size={16} />}
                Add
              </button>
            </div>
          </form>

          <div className="admin-category-list" aria-label="Product categories">
            {categories.length === 0 ? (
              <p className="admin-category-empty">No categories yet. Add one above.</p>
            ) : categories.map((category) => (
              <div className="admin-category-row" key={category.name}>
                <div className="admin-category-details">
                  <span className="admin-category-name">{category.name}</span>
                  <span className="admin-category-count">
                    {category.productCount} product{category.productCount === 1 ? "" : "s"}
                  </span>
                </div>
                {category.id && (
                  <button
                    className="admin-action-btn admin-action-btn--delete"
                    type="button"
                    onClick={() => handleDelete(category)}
                    disabled={category.productCount > 0 || deletingId === category.id}
                    title={category.productCount > 0 ? "Reassign its products before deleting" : "Delete category"}
                    aria-label={`Delete ${category.name}`}
                  >
                    {deletingId === category.id ? <Loader2 size={15} className="admin-spin" /> : <Trash2 size={15} />}
                  </button>
                )}
              </div>
            ))}
          </div>

          <p className="admin-category-note">
            Categories with products assigned must be cleared before they can be deleted.
          </p>
        </div>
      </div>
    </div>
  );
}
