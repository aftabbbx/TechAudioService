#!/usr/bin/env node
/**
 * Seed the first admin account into MongoDB.
 * Run once: node utils/seedAdmin.js
 *
 * Credentials are read from .env (ADMIN_EMAIL, ADMIN_PASSWORD).
 * Never hardcode credentials here.
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const connectDB = require("../config/db");

const seed = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = "Super Admin";

  if (!email || !password) {
    console.error("❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
    process.exit(1);
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`ℹ️  Admin already exists: ${email}`);
    process.exit(0);
  }

  await Admin.create({ email, password, name, role: "superadmin" });
  console.log(`✅ Admin seeded successfully: ${email}`);
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
