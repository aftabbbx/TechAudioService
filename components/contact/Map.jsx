import { siteConfig } from "@/data/site";

export function Map() {
  const primaryOffice = siteConfig.contact.offices[0];
  const mapUrl = primaryOffice?.mapUrl;

  if (!mapUrl) {
    return (
      <div
        className="rounded-xl overflow-hidden h-[300px] flex items-center justify-center"
        style={{ backgroundColor: "var(--surface-alt)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Map unavailable</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden h-[300px]">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`${primaryOffice.name} location`}
      />
    </div>
  );
}
