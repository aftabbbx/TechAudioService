"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { siteConfig } from "@/data/site";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const initialForm = {
  name: "",
  phone: "",
  email: "",
  company: "",
  location: "",
  service: "",
  venueType: "",
  timeline: "",
  product: "",
  message: "",
};

const services = [
  "System Consultation",
  "Professional Audio Systems",
  "Cinema & Theatre Sound",
  "Design & Engineering",
  "Installation & Commissioning",
  "Maintenance & AMC",
  "Product / Dealer Enquiry",
  "Technical Support",
  "Other",
];

const venueTypes = [
  "Cinema / Theatre",
  "Auditorium / Performing Arts",
  "Hotel / Restaurant / Retail",
  "Place of Worship",
  "Corporate / Conference Room",
  "Live Venue / Event Space",
  "Home / Private Cinema",
  "Other",
];

const timelines = [
  "As soon as possible",
  "Within 1 month",
  "Within 1–3 months",
  "Within 3–6 months",
  "Planning / researching",
];

export function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Full name is required";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required";
    else if (!/^[+\d\s().-]+$/.test(form.phone.trim()) || !/^\d{7,15}$/.test(form.phone.replace(/\D/g, ""))) {
      nextErrors.phone = "Enter a valid phone number";
    }
    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email";
    }
    if (!form.service) nextErrors.service = "Please choose the service you need";
    if (!form.message.trim()) nextErrors.message = "Message is required";
    return nextErrors;
  };

  const isReadyToSend = Object.keys(validate()).length === 0;

  const validateField = (event) => {
    const { name } = event.target;
    const fieldError = validate()[name] || "";
    setErrors((current) => ({ ...current, [name]: fieldError }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "loading") return;
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    if (!WEB3FORMS_KEY) {
      setSubmitError("The email form is not configured yet. Please email us directly.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setSubmitError("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...form,
          access_key: WEB3FORMS_KEY,
          subject: `New AudioTechServices enquiry${form.service ? ` — ${form.service}` : ""}`,
          from_name: "AudioTechServices Website Enquiry",
          replyto: form.email,
          botcheck: false,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "We could not send your message. Please try again.");
      }

      setForm(initialForm);
      setErrors({});
      setStatus("success");
    } catch (error) {
      setSubmitError(error.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const fieldClass = "contact-form-control w-full px-4 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent";

  if (status === "success") {
    return (
      <div className="contact-form-success bg-white rounded-xl border p-10 text-center" style={{ borderColor: "var(--border)" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}>
          <CheckCircle size={32} style={{ color: "#22c55e" }} />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Message sent successfully</h3>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          Thank you for reaching out. Our team will respond within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-sm font-semibold cursor-pointer"
          style={{ color: "var(--accent)" }}
        >
          Send another message
        </button>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="contact-form-success bg-white rounded-xl border p-10 text-center" style={{ borderColor: "var(--border)" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
          <AlertCircle size={30} style={{ color: "#ef4444" }} />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Message not sent</h3>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{submitError}</p>
        {!WEB3FORMS_KEY && (
          <a href={`mailto:${siteConfig.contact.email}`} className="block text-sm font-semibold mb-4" style={{ color: "var(--accent)" }}>
            {siteConfig.contact.email}
          </a>
        )}
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-sm font-semibold cursor-pointer"
          style={{ color: "var(--accent)" }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="contact-form-card bg-white rounded-xl border p-8" style={{ borderColor: "var(--border)" }}>
      <h2 className="contact-form-title text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Tell Us About Your Project</h2>
      <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
        Share a few details and our audio team will recommend the right next step.
      </p>

      <div className="space-y-5">
        <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        <p className="text-xs font-bold uppercase tracking-[0.12em] pt-1" style={{ color: "var(--accent)" }}>Your details</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-name" className="contact-form-label block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={form.name}
              onChange={updateField}
              onBlur={validateField}
              className={fieldClass}
              style={{ borderColor: errors.name ? "#ef4444" : "var(--border)", color: "var(--text)" }}
              placeholder="Your full name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
            />
            {errors.name && <p id="contact-name-error" className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="contact-phone" className="contact-form-label block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={updateField}
              onBlur={validateField}
              className={fieldClass}
              style={{ borderColor: errors.phone ? "#ef4444" : "var(--border)", color: "var(--text)" }}
              placeholder="+91 92179 86241"
              required
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "contact-phone-error" : undefined}
            />
            {errors.phone && <p id="contact-phone-error" className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="contact-email" className="contact-form-label block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={updateField}
            onBlur={validateField}
            className={fieldClass}
            style={{ borderColor: errors.email ? "#ef4444" : "var(--border)", color: "var(--text)" }}
            placeholder="your@email.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email && <p id="contact-email-error" className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-company" className="contact-form-label block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
              Company / Organisation <span className="font-normal opacity-60">(optional)</span>
            </label>
            <input id="contact-company" name="company" type="text" autoComplete="organization" value={form.company} onChange={updateField} className={fieldClass} style={{ borderColor: "var(--border)", color: "var(--text)" }} placeholder="Your company or organisation" />
          </div>
          <div>
            <label htmlFor="contact-location" className="contact-form-label block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
              Project City / Location <span className="font-normal opacity-60">(optional)</span>
            </label>
            <input id="contact-location" name="location" type="text" autoComplete="address-level2" value={form.location} onChange={updateField} className={fieldClass} style={{ borderColor: "var(--border)", color: "var(--text)" }} placeholder="City, state or country" />
          </div>
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.12em] pt-2" style={{ color: "var(--accent)" }}>Project requirements</p>

        <div>
          <label htmlFor="contact-service" className="contact-form-label block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
            Service <span className="text-red-500">*</span>
          </label>
          <select
            id="contact-service"
            name="service"
            value={form.service}
            onChange={updateField}
            onBlur={validateField}
            className={fieldClass}
            style={{ borderColor: errors.service ? "#ef4444" : "var(--border)", color: form.service ? "var(--text)" : "#8791a2" }}
            required
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? "contact-service-error" : undefined}
          >
            <option value="">Select a service</option>
            {services.map((service) => <option key={service} value={service}>{service}</option>)}
          </select>
          {errors.service && <p id="contact-service-error" className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.service}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-venue" className="contact-form-label block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
              Venue / Project Type <span className="font-normal opacity-60">(optional)</span>
            </label>
            <select id="contact-venue" name="venueType" value={form.venueType} onChange={updateField} className={fieldClass} style={{ borderColor: "var(--border)", color: form.venueType ? "var(--text)" : "#8791a2" }}>
              <option value="">Choose a venue type</option>
              {venueTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="contact-timeline" className="contact-form-label block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
              Project Timeline <span className="font-normal opacity-60">(optional)</span>
            </label>
            <select id="contact-timeline" name="timeline" value={form.timeline} onChange={updateField} className={fieldClass} style={{ borderColor: "var(--border)", color: form.timeline ? "var(--text)" : "#8791a2" }}>
              <option value="">When are you looking to start?</option>
              {timelines.map((timeline) => <option key={timeline} value={timeline}>{timeline}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="contact-product" className="contact-form-label block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
            Product / Model of Interest <span className="font-normal opacity-60">(optional)</span>
          </label>
          <input id="contact-product" name="product" type="text" value={form.product} onChange={updateField} className={fieldClass} style={{ borderColor: "var(--border)", color: "var(--text)" }} placeholder="Product name, model or category" />
        </div>

        <div>
          <label htmlFor="contact-message" className="contact-form-label block text-sm font-medium mb-1.5" style={{ color: "var(--text)" }}>
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            value={form.message}
            onChange={updateField}
            onBlur={validateField}
            rows={5}
            className={`${fieldClass} resize-none`}
            style={{ borderColor: errors.message ? "#ef4444" : "var(--border)", color: "var(--text)" }}
            placeholder="Tell us about the venue, audience size, sound requirements, existing equipment, or anything else that will help us plan your solution."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
          />
          {errors.message && <p id="contact-message-error" className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.message}</p>}
        </div>

        {!isReadyToSend && (
          <p className="text-xs text-center" style={{ color: "var(--text-secondary)" }} aria-live="polite">
            Complete the fields marked * with a valid phone number and email to enable Send Message.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || !isReadyToSend}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg text-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {status === "loading" ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <><Send size={16} />Send Message</>
          )}
        </button>
      </div>
    </form>
  );
}
