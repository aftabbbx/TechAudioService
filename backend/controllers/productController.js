const fs = require('fs');
const path = require('path');
const Product = require("../models/Product");
const { uploadImageSafe, deleteFromCloudinary, uploadPdfSafe } = require("../utils/cloudinary");
const slugify = require("slugify");

// Helper to save PDF locally
const savePdfLocally = (buffer, originalName) => {
  const uploadsDir = path.join(__dirname, "../../public/uploads/pdfs");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filename = `${Date.now()}-${slugify(originalName, { lower: true })}`;
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/pdfs/${filename}`; // Return public URL path
};

// Helper to delete local PDF
const deleteLocalPdf = (pdfUrl) => {
  if (!pdfUrl || !pdfUrl.includes('/uploads/pdfs/')) return;
  try {
    const filename = pdfUrl.split('/').pop();
    const filePath = path.join(__dirname, "../../public/uploads/pdfs", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Error deleting local PDF:", error.message);
  }
};

// ─────────────────────────────────────────────
//  PUBLIC CONTROLLERS
// ─────────────────────────────────────────────

const getPublicProducts = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = { status: "active" };
    if (category && category !== "All") filter.category = category;
    if (featured === "true") filter.featured = true;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    console.error("Get public products error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const getPublicProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, status: "active" });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get product by slug error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
//  ADMIN CONTROLLERS
// ─────────────────────────────────────────────

const getAdminProducts = async (req, res) => {
  try {
    const { search, category, status, featured, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (status && status !== "All") filter.status = status;
    if (featured === "true") filter.featured = true;
    if (featured === "false") filter.featured = false;

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { model: { $regex: q, $options: "i" } },
        { sku: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const [totalCount, activeCount, inactiveCount, featuredCount] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ status: "active" }),
      Product.countDocuments({ status: "inactive" }),
      Product.countDocuments({ featured: true }),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      stats: { total: totalCount, active: activeCount, inactive: inactiveCount, featured: featuredCount },
      products,
    });
  } catch (error) {
    console.error("Get admin products error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const getAdminProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get product by id error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, model, price, category, brand, description, sku, badge, specs, featured, status } = req.body;

    const existingSku = await Product.findOne({ sku: sku?.toUpperCase() });
    if (existingSku) {
      return res.status(400).json({ success: false, message: "SKU already exists." });
    }

    let image = { url: "", publicId: "" };
    if (req.files?.image?.[0]) {
      const imgFile = req.files.image[0];
      image = await uploadImageSafe(imgFile.buffer, imgFile.originalname);
    }

    let pdf = { url: "", publicId: "" };
    if (req.files?.pdf?.[0]) {
      const pdfFile = req.files.pdf[0];
      const result = await uploadPdfSafe(pdfFile.buffer, pdfFile.originalname);
      pdf = { url: result.url, publicId: result.publicId };
    }

    let parsedSpecs = [];
    if (specs) {
      try {
        const raw = typeof specs === "string" ? JSON.parse(specs) : specs;
        // Accept both string[] (Products) and {label,value}[] (Cinema) safely
        parsedSpecs = Array.isArray(raw) ? raw : [];
      } catch {
        parsedSpecs = [];
      }
    }

    let slug = slugify(name, { lower: true, strict: true });
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) slug = `${slug}-${Date.now()}`;

    const product = await Product.create({
      name,
      slug,
      model: model || "",
      price: price !== undefined && price !== "" ? Number(price) : 0,
      category,
      brand: brand || "AudioTechServices",
      description,
      sku,
      badge: badge || "",
      specs: parsedSpecs,
      image,
      pdf,
      featured: featured === "true" || featured === true,
      status: status || "active",
    });

    res.status(201).json({ success: true, message: "Product created successfully.", product });
  } catch (error) {
    console.error("Create product error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate field value." });
    }
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const { name, model, price, category, brand, description, sku, badge, specs, featured, status } = req.body;

    if (sku && sku.toUpperCase() !== product.sku) {
      const existingSku = await Product.findOne({ sku: sku.toUpperCase(), _id: { $ne: product._id } });
      if (existingSku) {
        return res.status(400).json({ success: false, message: "SKU already exists." });
      }
    }

    let image = product.image;
    if (req.files?.image?.[0]) {
      if (product.image?.publicId) {
        await deleteFromCloudinary(product.image.publicId);
      }
      const imgFile = req.files.image[0];
      image = await uploadImageSafe(imgFile.buffer, imgFile.originalname);
    }

    let pdf = product.pdf;
    if (req.files?.pdf?.[0]) {
      if (product.pdf?.url && product.pdf.url.includes('/uploads/pdfs/')) {
        deleteLocalPdf(product.pdf.url);
      } else if (product.pdf?.publicId) {
        await deleteFromCloudinary(product.pdf.publicId, "raw");
      }
      const pdfFile = req.files.pdf[0];
      const result = await uploadPdfSafe(pdfFile.buffer, pdfFile.originalname);
      pdf = { url: result.url, publicId: result.publicId };
    }

    let parsedSpecs = product.specs;
    if (specs !== undefined) {
      try {
        const raw = typeof specs === "string" ? JSON.parse(specs) : specs;
        parsedSpecs = Array.isArray(raw) ? raw : product.specs;
      } catch {
        parsedSpecs = product.specs;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name || product.name,
        model: model !== undefined ? model : product.model,
        price: price !== undefined && price !== "" ? Number(price) : product.price,
        category: category || product.category,
        brand: brand || product.brand,
        description: description || product.description,
        sku: sku ? sku.toUpperCase() : product.sku,
        badge: badge !== undefined ? badge : product.badge,
        specs: parsedSpecs,
        image,
        pdf,
        featured: featured !== undefined ? (featured === "true" || featured === true) : product.featured,
        status: status || product.status,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: "Product updated successfully.", product: updatedProduct });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    if (product.image?.publicId) {
      await deleteFromCloudinary(product.image.publicId);
    }
    
    if (product.pdf?.url && product.pdf.url.includes('/uploads/pdfs/')) {
      deleteLocalPdf(product.pdf.url);
    } else if (product.pdf?.publicId) {
      await deleteFromCloudinary(product.pdf.publicId, "raw");
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  getPublicProducts,
  getPublicProductBySlug,
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
