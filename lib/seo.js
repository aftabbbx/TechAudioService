import { siteConfig } from "@/data/site";

export const SITE_URL = siteConfig.url.replace(/\/$/, "");

function toAbsoluteUrl(value, fallback = "/") {
  try {
    return new URL(value || fallback, `${SITE_URL}/`).href;
  } catch {
    return new URL(fallback, `${SITE_URL}/`).href;
  }
}

function cleanPageTitle(value) {
  const title = String(value || siteConfig.name).trim();
  const escapedBrand = siteConfig.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return title.replace(new RegExp(`(?:\\s*[|–—-]\\s*|\\s+)${escapedBrand}$`, "i"), "").trim();
}

export function buildPageMetadata({ title, description, path, image = "/logo.png", type = "website" }) {
  const pageTitle = cleanPageTitle(title);
  const cleanDescription = String(description || "")
    .replace(/\s+/g, " ")
    .trim();
  const metaDescription = cleanDescription.length > 160
    ? `${cleanDescription.slice(0, 157).replace(/\s+\S*$/, "").trimEnd()}...`
    : cleanDescription;
  const socialTitle = `${pageTitle} | ${siteConfig.name}`;
  const absolutePath = toAbsoluteUrl(path || "/");
  const absoluteImage = toAbsoluteUrl(image, "/logo.png");

  return {
    title: pageTitle,
    description: metaDescription,
    alternates: { canonical: absolutePath },
    openGraph: {
      title: socialTitle,
      description: metaDescription,
      url: absolutePath,
      siteName: siteConfig.name,
      type,
      locale: "en_IN",
      images: [{ url: absoluteImage, alt: `${siteConfig.name} — ${title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: metaDescription,
      images: [absoluteImage],
    },
  };
}

export function productStructuredData(product, path) {
  const image = toAbsoluteUrl(product.image, "/logo.png");

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image,
    sku: product.model || product.id,
    mpn: product.model || undefined,
    category: product.category,
    brand: { "@type": "Brand", name: siteConfig.name },
    url: toAbsoluteUrl(path),
    additionalProperty: (product.specs || []).map((spec, index) => ({
      "@type": "PropertyValue",
      name: spec.label || `Specification ${index + 1}`,
      value: spec.value,
    })),
  };
}

export function breadcrumbStructuredData({ section, sectionPath, item }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: section, item: toAbsoluteUrl(sectionPath) },
      { "@type": "ListItem", position: 3, name: item.name, item: toAbsoluteUrl(item.path) },
    ],
  };
}

export function siteStructuredData() {
  const offices = siteConfig.contact.offices.map((office) => {
    const isIndiaOffice = office.name === "India Office";
    const address = {
      "@type": "PostalAddress",
      ...(isIndiaOffice
        ? {
            streetAddress: "Building No. 12, 13, Khasra Nos. 41, 2, 3, Uday Vihar Part-3, M-Block, Nilothi Extension",
            addressLocality: "New Delhi",
            addressRegion: "Delhi",
            postalCode: "110041",
            addressCountry: "IN",
          }
        : {
            streetAddress: "168 Harehills Lane",
            addressLocality: "Leeds",
            addressRegion: "England",
            postalCode: "LS8 5JP",
            addressCountry: "GB",
          }),
    };

    return {
      address,
      location: {
        "@type": "Place",
        "@id": `${SITE_URL}/#${isIndiaOffice ? "india" : "uk"}-office`,
        name: `${siteConfig.name} ${office.name}`,
        address,
        ...(office.mapUrl ? { hasMap: office.mapUrl.replace("&output=embed", "") } : {}),
        ...(isIndiaOffice
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: 28.647605895996094,
                longitude: 77.06446838378906,
              },
            }
          : {}),
      },
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: siteConfig.name,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        description: siteConfig.description,
        email: siteConfig.contact.email,
        telephone: siteConfig.contact.phone,
        address: offices.map((office) => office.address),
        location: offices.map((office) => office.location),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer enquiries",
          email: siteConfig.contact.email,
          telephone: siteConfig.contact.phone,
        },
        sameAs: [
          "https://www.instagram.com/audiotechservices/",
          "https://www.youtube.com/@servicesaudiotech",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: siteConfig.name,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-IN",
      },
    ],
  };
}
