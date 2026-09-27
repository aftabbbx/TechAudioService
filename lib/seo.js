import { siteConfig } from "@/data/site";

export const SITE_URL = siteConfig.url.replace(/\/$/, "");

export function buildPageMetadata({ title, description, path, image = "/logo.png", type = "website" }) {
  const cleanDescription = String(description || "")
    .replace(/\s+/g, " ")
    .trim();
  const metaDescription = cleanDescription.length > 160
    ? `${cleanDescription.slice(0, 157).trimEnd()}...`
    : cleanDescription;
  const socialTitle = `${title} | ${siteConfig.name}`;
  const absoluteImage = image?.startsWith("http") ? image : `${SITE_URL}${image || "/logo.png"}`;

  return {
    title,
    description: metaDescription,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description: metaDescription,
      url: path,
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
  const image = product.image?.startsWith("http")
    ? product.image
    : product.image
      ? `${SITE_URL}${product.image}`
      : `${SITE_URL}/logo.png`;

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
    url: `${SITE_URL}${path}`,
    additionalProperty: (product.specs || []).map((spec, index) => ({
      "@type": "PropertyValue",
      name: spec.label || `Specification ${index + 1}`,
      value: spec.value,
    })),
  };
}

export function siteStructuredData() {
  const offices = siteConfig.contact.offices.map((office) => {
    return {
      "@type": "PostalAddress",
      ...(office.name === "India Office"
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
        address: offices,
        sameAs: Object.values(siteConfig.social),
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
