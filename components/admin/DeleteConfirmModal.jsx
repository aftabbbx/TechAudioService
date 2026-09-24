"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";

export function DeleteConfirmModal({ product, onConfirm, onCancel, deleting }) {
  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirm delete">
      <div className="admin-modal admin-modal--sm">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Delete Product</h2>
          <button className="admin-modal-close" onClick={onCancel} aria-label="Close" disabled={deleting}>
            <X size={20} />
          </button>
        </div>
        <div className="admin-modal-body">
          <div className="admin-delete-icon">
            <AlertTriangle size={32} style={{ color: "#CC2D2D" }} />
          </div>
          <p className="admin-delete-text">
            Are you sure you want to delete{" "}
            <strong>&ldquo;{product.name}&rdquo;</strong>?
          </p>
          <p className="admin-delete-sub">
            This will permanently remove the product and its Cloudinary image. This action cannot be undone.
          </p>
        </div>
        <div className="admin-modal-footer">
          <button
            className="admin-btn admin-btn--ghost"
            onClick={onCancel}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            className="admin-btn admin-btn--danger"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Loader2 size={16} className="admin-spin" />
                Deleting…
              </>
            ) : (
              "Delete Product"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
