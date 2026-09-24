#!/usr/bin/env node
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Cinema = require("../models/Cinema");
const { cinemaProducts } = require("../../data/cinemaProducts");

const seed = async () => {
  await connectDB();

  const reset = process.argv.includes("--reset");

  if (reset) {
    await Cinema.deleteMany({});
    console.log("🗑️  All existing cinema products cleared.");
  }

  let inserted = 0;
  let skipped = 0;

  for (const productData of cinemaProducts) {
    const sku = productData.id;
    const existing = await Cinema.findOne({ slug: sku }); // Or search by name
    
    // Some mapping is needed
    if (existing) {
      console.log(`⏭️  Skipped (already exists): ${productData.name}`);
      skipped++;
      continue;
    }

    const payload = {
      name: productData.name,
      model: productData.model,
      category: productData.category,
      badge: productData.badge || "",
      description: productData.description,
      specs: productData.specs,
      image: { url: productData.image, publicId: "" },
      pdf: { url: productData.pdf || "", publicId: "" },
      status: "active",
    };

    await Cinema.create(payload);
    console.log(`✅ Seeded: ${productData.name}`);
    inserted++;
  }

  console.log(`\n📦 Done. Inserted: ${inserted} | Skipped: ${skipped}`);
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed error:", err.message);
  process.exit(1);
});
