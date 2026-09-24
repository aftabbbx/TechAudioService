import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { siteConfig } from "@/data/site";

export function ContactInfo() {
  return (
    <div className="rounded-xl p-8 h-full" style={{ backgroundColor: "var(--primary-deeper)", color: "white" }}>
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
      <p className="text-sm opacity-60 mb-8 leading-relaxed">
        Reach out to our professional audio experts for consultations, system design, or dealership enquiries.
      </p>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0"><Mail size={18} /></div>
          <div>
            <p className="text-sm font-medium mb-1 opacity-50">Email</p>
            <a href={`mailto:${siteConfig.contact.email}`} className="text-sm hover:underline">{siteConfig.contact.email}</a>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0"><Phone size={18} /></div>
          <div>
            <p className="text-sm font-medium mb-1 opacity-50">Phone</p>
            <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} className="text-sm hover:underline">{siteConfig.contact.phone}</a>
          </div>
        </div>
        {siteConfig.contact.offices.map((office) => (
          <div key={office.name} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0"><MapPin size={18} /></div>
            <div>
              <p className="text-sm font-medium mb-1 opacity-50">{office.name}</p>
              <p className="text-sm opacity-70 leading-relaxed">{office.address}</p>
            </div>
          </div>
        ))}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0"><Clock size={18} /></div>
          <div>
            <p className="text-sm font-medium mb-1 opacity-50">Working Hours</p>
            <p className="text-sm opacity-70">{siteConfig.contact.workingHours}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
