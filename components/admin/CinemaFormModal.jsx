"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2, AlertCircle, Check, ImageIcon, FileText, Plus, Trash2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const CATEGORIES = [
  "Amplifiers",
  "Digital Speakers",
  "Subwoofers",
  "Speaker Management",
  "Surround Speakers",
];

const EMPTY_FORM = {
  name: "",
  model: "",
  category: "Amplifiers",
  description: "",
  badge: "",
  status: "active",
};

export function CinemaFormModal({ product, onClose, onSuccess }) {
  const isEdit = Boolean(product);

  const [form, setForm] = useState(
    isEdit
      ? {
          name: product.name || "",
          model: product.model || "",
          category: product.category || "Amplifiers",
          description: product.description || "",
          badge: product.badge || "",
          status: product.status || "active",
        }
      : EMPTY_FORM
  );

  // Specs — dynamic list of { label, value }
  const [specs, setSpecs] = useState(
    isEdit && product.specs?.length ? [...product.specs] : [{ label: "", value: "" }]
  );

  // Image
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image?.url || null);
  const imageRef = useRef(null);

  // PDF
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfName, setPdfName] = useState(
    product?.pdf?.url ? product.pdf.url.split("/").pop() : null
  );
  const pdfRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Handlers ──────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setFieldErrors((fe) => ({ ...fe, [name]: "" }));
  };

  // Spec row handlers
  const addSpec = () => setSpecs((s) => [...s, { label: "", value: "" }]);
  const removeSpec = (i) => setSpecs((s) => s.filter((_, idx) => idx !== i));
  const updateSpecLabel = (i, val) =>
    setSpecs((s) => s.map((spec, idx) => (idx === i ? { ...spec, label: val } : spec)));
  const updateSpecValue = (i, val) =>
    setSpecs((s) => s.map((spec, idx) => (idx === i ? { ...spec, value: val } : spec)));

  // Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Image must be JPEG, PNG, or WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image is too large. Max 5MB.");
      return;
    }
    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // PDF
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("PDF is too large. Max 20MB.");
      return;
    }
    setError("");
    setPdfFile(file);
    setPdfName(file.name);
  };

  // ── Validation ────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Product name is required.";
    if (!form.category) errs.category = "Category is required.";
    if (!form.description.trim()) errs.description = "Description is required.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      // Append all text fields
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      // Append specs as JSON array
      const cleanSpecs = specs.filter((s) => s.label.trim() !== "" || s.value.trim() !== "");
      formData.append("specs", JSON.stringify(cleanSpecs));
      // Append files
      if (imageFile) formData.append("image", imageFile);
      if (pdfFile) formData.append("pdf", pdfFile);

      const url = isEdit
        ? `${API_URL}/api/admin/cinema/${product._id}`
        : `${API_URL}/api/admin/cinema`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save cinema product.");

      onSuccess(data.product, isEdit ? "updated" : "created");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div
      className="admin-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Edit cinema product" : "Add cinema product"}
    >
      <div className="admin-modal admin-modal--wide">
        {/* Header */}
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">
            {isEdit ? `Edit Cinema — ${product.model || product.name}` : "Add New Cinema Product"}
          </h2>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-body">
          {error && (
            <div className="admin-alert admin-alert--error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* ── Section: Basic Info ──────────────────────────────── */}
          <p className="admin-section-label">Basic Information</p>
          <div className="admin-form-grid">
            {/* Product Name */}
            <div className="admin-form-group admin-form-group--full">
              <label className="admin-label" htmlFor="pf-name">Product Name *</label>
              <input
                id="pf-name"
                name="name"
                type="text"
                className={`admin-input ${fieldErrors.name ? "admin-input--error" : ""}`}
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. 4-Channel Cinema Amplifier"
              />
              {fieldErrors.name && <p className="admin-field-error">{fieldErrors.name}</p>}
            </div>

            {/* Model */}
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="pf-model">Model Number</label>
              <input
                id="pf-model"
                name="model"
                type="text"
                className="admin-input"
                value={form.model}
                onChange={handleChange}
                placeholder="e.g. DCA4000-C"
              />
            </div>

            {/* Category */}
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="pf-category">Category *</label>
              <select
                id="pf-category"
                name="category"
                className="admin-input"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Badge */}
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="pf-badge">Badge</label>
              <input
                id="pf-badge"
                name="badge"
                type="text"
                className="admin-input"
                value={form.badge}
                onChange={handleChange}
                placeholder="e.g. Flagship, Reference"
              />
            </div>

            {/* Status */}
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="pf-status">Status</label>
              <select
                id="pf-status"
                name="status"
                className="admin-input"
                value={form.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Description */}
            <div className="admin-form-group admin-form-group--full">
              <label className="admin-label" htmlFor="pf-description">Description *</label>
              <textarea
                id="pf-description"
                name="description"
                rows={3}
                className={`admin-input admin-textarea ${fieldErrors.description ? "admin-input--error" : ""}`}
                value={form.description}
                onChange={handleChange}
                placeholder="Product description..."
              />
              {fieldErrors.description && (
                <p className="admin-field-error">{fieldErrors.description}</p>
              )}
            </div>
          </div>

          {/* ── Section: Specifications ──────────────────────────── */}
          <p className="admin-section-label" style={{ marginTop: 8 }}>Specifications (Key/Value pairs)</p>
          <div className="admin-specs-list">
            {specs.map((spec, i) => (
              <div key={i} className="admin-spec-row" style={{ display: 'flex', gap: '8px' }}>
                <span className="admin-spec-num">{i + 1}</span>
                <input
                  type="text"
                  className="admin-input"
                  style={{ flex: 1 }}
                  value={spec.label}
                  onChange={(e) => updateSpecLabel(i, e.target.value)}
                  placeholder="Label (e.g. LF Driver)"
                />
                <input
                  type="text"
                  className="admin-input"
                  style={{ flex: 2 }}
                  value={spec.value}
                  onChange={(e) => updateSpecValue(i, e.target.value)}
                  placeholder="Value (e.g. 15&quot; Neodymium)"
                />
                <button
                  type="button"
                  className="admin-spec-remove"
                  onClick={() => removeSpec(i)}
                  aria-label="Remove spec"
                  disabled={specs.length === 1}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="admin-btn admin-btn--ghost admin-btn--sm"
              onClick={addSpec}
              style={{ alignSelf: "flex-start" }}
            >
              <Plus size={14} /> Add Spec
            </button>
          </div>

          {/* ── Section: Image Upload ────────────────────────────── */}
          <p className="admin-section-label" style={{ marginTop: 8 }}>Product Image</p>
          <div className="admin-image-upload-area">
            {imagePreview ? (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div className="admin-image-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" className="admin-preview-img" />
                  <button
                    type="button"
                    className="admin-image-remove"
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
                <button
                  type="button"
                  className="admin-upload-replace"
                  onClick={() => imageRef.current?.click()}
                >
                  <Upload size={14} /> Replace Image
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="admin-upload-btn"
                onClick={() => imageRef.current?.click()}
              >
                <ImageIcon size={24} style={{ color: "var(--text-muted)" }} />
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  Click to upload product image
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                  JPEG · PNG · WebP · Max 5MB
                </span>
              </button>
            )}
            <input
              ref={imageRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          {/* ── Section: PDF Upload ──────────────────────────────── */}
          <p className="admin-section-label" style={{ marginTop: 8 }}>Datasheet / PDF</p>
          <div className="admin-pdf-upload-area">
            {pdfName ? (
              <div className="admin-pdf-preview">
                <FileText size={20} style={{ color: "var(--accent)", flexShrink: 0 }} />
                <span className="admin-pdf-name">{pdfName}</span>
                <button
                  type="button"
                  className="admin-upload-replace"
                  onClick={() => pdfRef.current?.click()}
                >
                  <Upload size={14} /> Replace PDF
                </button>
                <button
                  type="button"
                  className="admin-spec-remove"
                  onClick={() => { setPdfFile(null); setPdfName(null); }}
                  aria-label="Remove PDF"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="admin-upload-btn admin-upload-btn--pdf"
                onClick={() => pdfRef.current?.click()}
              >
                <FileText size={24} style={{ color: "var(--text-muted)" }} />
                <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                  Click to upload datasheet PDF (saved locally to /public/uploads/pdfs)
                </span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                  PDF only · Max 20MB
                </span>
              </button>
            )}
            <input
              ref={pdfRef}
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              style={{ display: "none" }}
            />
          </div>

          {/* ── Footer ──────────────────────────────────────────── */}
          <div className="admin-modal-footer" style={{ padding: 0, marginTop: 8 }}>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              id="pf-submit-btn"
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 size={16} className="admin-spin" />
                  {isEdit ? "Saving…" : "Creating…"}
                </>
              ) : (
                <>
                  <Check size={16} />
                  {isEdit ? "Save Changes" : "Create Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
