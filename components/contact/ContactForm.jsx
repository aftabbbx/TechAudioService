"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("loading");

    // Simulate form submission — connect your API/form provider here
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  if (status === "success") {
    return (
      <div className="contact-form-success bg-white rounded-xl border p-10 text-center" style={{ borderColor: "var(--border)" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}>
          <CheckCircle size={32} style={{ color: "#22c55e" }} />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Message Sent Successfully</h3>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          Thank you for reaching out. Our team will respond within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm font-semibold cursor-pointer"
          style={{ color: "var(--accent)" }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form-card bg-white rounded-xl border p-8" style={{ borderColor: "var(--border)" }}>
      <h2 className="contact-form-title text-xl font-bold mb-6" style={{ color: "var(--text)" }}>Send Us a Message</h2>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="contact-name" className="contact-form-label block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
            Full Name
          </label>
          <input
            id="contact-name"
            className="contact-form-control w-full px-4 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ borderColor: errors.name ? "#ef4444" : "var(--border)", color: "var(--text)" }}
            placeholder="Your full name"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="contact-form-label block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
            Email Address
          </label>
          <input
            id="contact-email"
            className="contact-form-control w-full px-4 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ borderColor: errors.email ? "#ef4444" : "var(--border)", color: "var(--text)" }}
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>}
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="contact-subject" className="contact-form-label block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
            Subject
          </label>
          <input
            id="contact-subject"
            className="contact-form-control w-full px-4 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            type="text"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            style={{ borderColor: errors.subject ? "#ef4444" : "var(--border)", color: "var(--text)" }}
            placeholder="How can we help?"
          />
          {errors.subject && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.subject}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="contact-message" className="contact-form-label block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
            Message
          </label>
          <textarea
            id="contact-message"
            className="contact-form-control w-full px-4 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={5}
            style={{ borderColor: errors.message ? "#ef4444" : "var(--border)", color: "var(--text)" }}
            placeholder="Tell us about your project..."
          />
          {errors.message && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {status === "loading" ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Send Message
            </>
          )}
        </button>
      </div>
    </form>
  );
}
