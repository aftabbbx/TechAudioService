#!/usr/bin/env node
/**
 * Seed all static products from data/products.js into MongoDB.
 * Images stay as local /public paths (no Cloudinary upload needed).
 * PDFs stay as local /public paths.
 *
 * Run: node utils/seedProducts.js
 * To reset & re-seed: node utils/seedProducts.js --reset
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");

// ─── All 12 static products — exact match with data/products.js ───────────────
const staticProducts = [
  {
    sku: "DCA4000",
    model: "DCA4000",
    name: "4-Channel Cinema Amplifier",
    category: "Amplifiers",
    brand: "AudioTechServices",
    description:
      "Professional 4-channel power amplifier engineered for cinema and large venue applications. Delivers pristine audio with ultra-low distortion across all channels.",
    image: { url: "/images/products/dca4000.webp", publicId: "" },
    badge: "Flagship",
    specs: ["4 Channels", "4 × 1000W @ 8Ω", "THD < 0.05%", "Network Control", "DSP Onboard", "Redundant PSU"],
    pdf: { url: "/pdfs/products/dca4000.pdf", publicId: "" },
    featured: true,
    price: 0,
    status: "active",
  },
  {
    sku: "DCA4002",
    model: "DCA4002",
    name: "2-Channel Cinema Amplifier",
    category: "Amplifiers",
    brand: "AudioTechServices",
    description:
      "High-power 2-channel amplifier designed for screen channel and subwoofer duty in cinema environments. Exceptional thermal management for continuous operation.",
    image: { url: "/images/products/dca4002.webp", publicId: "" },
    badge: "Popular",
    specs: ["2 Channels", "2 × 2000W @ 8Ω", "THD < 0.03%", "Convection Cooled", "Bridgeable", "Rack Mount"],
    pdf: { url: "/pdfs/products/dca4002.pdf", publicId: "" },
    featured: true,
    price: 0,
    status: "active",
  },
  {
    sku: "DCA2000",
    model: "DCA2000",
    name: "Compact Power Amplifier",
    category: "Amplifiers",
    brand: "AudioTechServices",
    description:
      "Compact yet powerful amplifier ideal for distributed audio, fill speakers, and smaller venue applications requiring reliable performance.",
    image: { url: "/images/products/dca2000.webp", publicId: "" },
    badge: "",
    specs: ["2 Channels", "2 × 1000W @ 8Ω", "Class-D Topology", "Lightweight Design", "GPIO Control", "1U Rack"],
    pdf: { url: "/pdfs/products/dca2000.pdf", publicId: "" },
    featured: false,
    price: 0,
    status: "active",
  },
  {
    sku: "DCA1500",
    model: "DCA1500",
    name: "Multi-Zone Amplifier",
    category: "Amplifiers",
    brand: "AudioTechServices",
    description:
      "Versatile multi-zone amplifier with independent channel control, ideal for commercial installations requiring flexible zone management.",
    image: { url: "/images/products/dca1500.webp", publicId: "" },
    badge: "",
    specs: ["4 Channels", "4 × 500W @ 8Ω", "Zone Control", "Priority Routing", "70V/100V Compatible", "Ethernet"],
    pdf: { url: "", publicId: "" },
    featured: false,
    price: 0,
    status: "active",
  },
  {
    sku: "DSM48PLUS",
    model: "DSM48+",
    name: "Digital Speaker Management Processor",
    category: "DSP / Processing",
    brand: "AudioTechServices",
    description:
      "Advanced 4-in / 8-out DSP processor with comprehensive EQ, crossover, delay, and dynamics processing for complete system tuning and optimization.",
    image: { url: "/images/products/dsm48plus.webp", publicId: "" },
    badge: "Best Seller",
    specs: ["4 In / 8 Out", "96kHz / 24-bit", "Parametric EQ", "FIR Filters", "Network Control", "Dante Ready"],
    pdf: { url: "/pdfs/products/dsm48plus.pdf", publicId: "" },
    featured: true,
    price: 0,
    status: "active",
  },
  {
    sku: "DSM26",
    model: "DSM26",
    name: "Compact DSP Processor",
    category: "DSP / Processing",
    brand: "AudioTechServices",
    description:
      "Cost-effective 2-in / 6-out digital processor for straightforward speaker management applications in houses of worship and conference rooms.",
    image: { url: "/images/products/dsm26.webp", publicId: "" },
    badge: "",
    specs: ["2 In / 6 Out", "48kHz / 24-bit", "8-Band PEQ", "Linkwitz-Riley Crossovers", "USB Config", "Compact 1U"],
    pdf: { url: "", publicId: "" },
    featured: false,
    price: 0,
    status: "active",
  },
  {
    sku: "CX-15",
    model: "CX-15",
    name: "Coaxial Stage Monitor",
    category: "Digital Speakers",
    brand: "AudioTechServices",
    description:
      "High-output 15-inch coaxial stage monitor with rotatable horn, delivering exceptional clarity and coverage for live performance monitoring.",
    image: { url: "/images/products/cx15.webp", publicId: "" },
    badge: "",
    specs: ['15" LF + 1.4" HF', "Coaxial Design", "600W Program", "Rotatable Horn", "90° × 60° Coverage", "Birch Plywood"],
    pdf: { url: "", publicId: "" },
    featured: false,
    price: 0,
    status: "active",
  },
  {
    sku: "LA-210",
    model: "LA-210",
    name: 'Dual 10" Line Array',
    category: "Digital Speakers",
    brand: "AudioTechServices",
    description:
      "Compact dual 10-inch line array element designed for touring and installed applications requiring precise, long-throw coverage.",
    image: { url: "/images/products/la210.webp", publicId: "" },
    badge: "New",
    specs: ['2 × 10" LF', '1.4" Compression HF', "800W Program", "Rigging Hardware", "Weather Resistant", "Arrayable"],
    pdf: { url: "", publicId: "" },
    featured: true,
    price: 0,
    status: "active",
  },
  {
    sku: "SUB-18",
    model: "SUB-18",
    name: '18" Powered Subwoofer',
    category: "Subwoofers",
    brand: "AudioTechServices",
    description:
      "High-excursion 18-inch powered subwoofer delivering deep, impactful low-frequency reinforcement for cinema, live, and installed applications.",
    image: { url: "/images/products/sub18.webp", publicId: "" },
    badge: "",
    specs: ['18" Long-Excursion Driver', "1200W RMS", "Built-in DSP", "Adjustable Crossover", "Cardioid Capable", "Tour-Grade Cabinet"],
    pdf: { url: "", publicId: "" },
    featured: false,
    price: 0,
    status: "active",
  },
  {
    sku: "SUB-21",
    model: "SUB-21",
    name: '21" Cinema Subwoofer',
    category: "Subwoofers",
    brand: "AudioTechServices",
    description:
      "Massive 21-inch cinema subwoofer designed for deep bass extension in large auditoriums, delivering room-filling low-frequency impact.",
    image: { url: "/images/products/sub21.webp", publicId: "" },
    badge: "Cinema",
    specs: ['21" Neodymium Driver', "2000W Program", "18Hz Extension", "Bandpass Design", "Dolby Atmos Ready", "M20 Pole Mount"],
    pdf: { url: "", publicId: "" },
    featured: true,
    price: 0,
    status: "active",
  },
  {
    sku: "SCM-36",
    model: "SCM-36",
    name: "Speaker Controller Matrix",
    category: "Speaker Management",
    brand: "AudioTechServices",
    description:
      "Sophisticated speaker controller matrix with comprehensive routing, level management, and protection features for complex multi-zone installations.",
    image: { url: "/images/products/scm36.webp", publicId: "" },
    badge: "",
    specs: ["3 In / 6 Out Matrix", "Real-time Monitoring", "Limiter Protection", "Dante Interface", "GPIO Triggers", "Web Interface"],
    pdf: { url: "", publicId: "" },
    featured: false,
    price: 0,
    status: "active",
  },
  {
    sku: "CSM-800",
    model: "CSM-800",
    name: "Cinema Sound Manager",
    category: "Cinema Audio",
    brand: "AudioTechServices",
    description:
      "All-in-one cinema sound management system providing complete control over auditorium audio including EQ, delay, level, and automation.",
    image: { url: "/images/products/csm800.webp", publicId: "" },
    badge: "Cinema Pro",
    specs: ["8-Channel Processor", "Auto-EQ System", "Room Correction", "Show Automation", "SMPTE Sync", "Touchscreen UI"],
    pdf: { url: "/pdfs/products/csm800.pdf", publicId: "" },
    featured: true,
    price: 0,
    status: "active",
  },
];

const seed = async () => {
  await connectDB();

  const reset = process.argv.includes("--reset");

  if (reset) {
    await Product.deleteMany({});
    console.log("🗑️  All existing products cleared.");
  }

  let inserted = 0;
  let skipped = 0;

  for (const productData of staticProducts) {
    const existing = await Product.findOne({ sku: productData.sku });
    if (existing) {
      console.log(`⏭️  Skipped (already exists): ${productData.sku} — ${productData.name}`);
      skipped++;
      continue;
    }

    await Product.create(productData);
    console.log(`✅ Seeded: ${productData.sku} — ${productData.name}`);
    inserted++;
  }

  console.log(`\n📦 Done. Inserted: ${inserted} | Skipped: ${skipped}`);
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed error:", err.message);
  process.exit(1);
});
