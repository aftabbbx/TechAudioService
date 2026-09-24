const cloudinary = require("../config/cloudinary");
const path = require("path");
const fs = require("fs");
const slugify = require("slugify");

/**
 * Upload an image buffer to Cloudinary under products/ folder.
 * Falls back to saving locally if Cloudinary rejects (403/401).
 */
const uploadToCloudinary = (buffer, publicId = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: "products",
      resource_type: "image",
      type: "upload",
      transformation: [
        { width: 1200, height: 900, crop: "limit" },
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    };
    if (publicId) {
      options.public_id = publicId;
      options.overwrite = true;
    }

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve({ url: result.secure_url, publicId: result.public_id });
    });

    uploadStream.end(buffer);
  });
};

/**
 * Upload a PDF buffer to Cloudinary under products/pdfs/ folder.
 */
const uploadPdfToCloudinary = (buffer, publicId = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: "products/pdfs",
      resource_type: "raw",
      format: "pdf",
    };
    if (publicId) {
      options.public_id = publicId;
      options.overwrite = true;
    }

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve({ url: result.secure_url, publicId: result.public_id });
    });

    uploadStream.end(buffer);
  });
};

/**
 * Save image locally to /public/uploads/images/ as fallback.
 * Returns { url, publicId: "" }
 */
const saveImageLocally = (buffer, originalName = "image.jpg") => {
  const uploadsDir = path.join(__dirname, "../../public/uploads/images");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const ext = path.extname(originalName) || ".jpg";
  const filename = `${Date.now()}-${slugify(path.basename(originalName, ext), { lower: true, strict: true })}${ext}`;
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return { url: `/uploads/images/${filename}`, publicId: "" };
};

/**
 * Upload image — tries Cloudinary first, falls back to local storage on 403/401.
 */
const uploadImageSafe = async (buffer, originalName = "product.jpg", publicId = null) => {
  try {
    return await uploadToCloudinary(buffer, publicId);
  } catch (err) {
    if (err.http_code === 403 || err.http_code === 401) {
      console.warn(`⚠️  Cloudinary upload blocked (${err.http_code}) — saving image locally instead.`);
      return saveImageLocally(buffer, originalName);
    }
    throw err; // Re-throw other errors
  }
};

/**
 * Delete any asset from Cloudinary by publicId.
 * Only calls Cloudinary if publicId is a real Cloudinary path (not empty/"").
 */
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  // Only delete from Cloudinary if publicId looks like a real Cloudinary path
  if (!publicId || publicId.trim() === "") return;
  // Local paths starting with / are not Cloudinary IDs
  if (publicId.startsWith("/")) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    // Non-fatal — log and continue
    console.error("Warning: Could not delete from Cloudinary:", error.message);
  }
};

module.exports = {
  uploadToCloudinary,
  uploadPdfToCloudinary,
  uploadImageSafe,
  saveImageLocally,
  deleteFromCloudinary,
};
