const fs = require('fs');
const path = require('path');
const Cinema = require("../models/Cinema");
const { uploadImageSafe, deleteFromCloudinary } = require("../utils/cloudinary");
const slugify = require("slugify");

const savePdfLocally = (buffer, originalName) => {
  const uploadsDir = path.join(__dirname, "../../public/uploads/pdfs");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filename = `${Date.now()}-${slugify(originalName, { lower: true })}`;
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/pdfs/${filename}`;
};

const deleteLocalPdf = (pdfUrl) => {
  if (!pdfUrl || !pdfUrl.startsWith('/uploads/pdfs/')) return;
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

const getPublicCinemaProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { status: "active" };
    if (category && category !== "All") filter.category = category;

    const products = await Cinema.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    console.error("Get public cinema products error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ─────────────────────────────────────────────
//  ADMIN CONTROLLERS
// ─────────────────────────────────────────────

const getAdminCinemaProducts = async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (status && status !== "All") filter.status = status;

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { model: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Cinema.countDocuments(filter);
    const products = await Cinema.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const [totalCount, activeCount, inactiveCount] = await Promise.all([
      Cinema.countDocuments({}),
      Cinema.countDocuments({ status: "active" }),
      Cinema.countDocuments({ status: "inactive" }),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      stats: { total: totalCount, active: activeCount, inactive: inactiveCount },
      products,
    });
  } catch (error) {
    console.error("Get admin cinema products error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const getAdminCinemaProductById = async (req, res) => {
  try {
    const product = await Cinema.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Cinema product not found." });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get cinema product by id error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const createCinemaProduct = async (req, res) => {
  try {
    const { name, model, category, description, badge, specs, status } = req.body;

    let image = { url: "", publicId: "" };
    if (req.files?.image?.[0]) {
      const imgFile = req.files.image[0];
      image = await uploadImageSafe(imgFile.buffer, imgFile.originalname);
    }

    let pdf = { url: "", publicId: "" };
    if (req.files?.pdf?.[0]) {
      const pdfUrl = savePdfLocally(req.files.pdf[0].buffer, req.files.pdf[0].originalname);
      pdf = { url: pdfUrl, publicId: "" };
    }

    let parsedSpecs = [];
    if (specs) {
      try {
        parsedSpecs = typeof specs === "string" ? JSON.parse(specs) : specs;
      } catch (e) {
        console.error("Error parsing specs:", e);
      }
    }

    let slug = slugify(name, { lower: true, strict: true });
    const existingSlug = await Cinema.findOne({ slug });
    if (existingSlug) slug = `${slug}-${Date.now()}`;

    const product = await Cinema.create({
      name,
      slug,
      model: model || "",
      category,
      description,
      badge: badge || "",
      specs: parsedSpecs,
      image,
      pdf,
      status: status || "active",
    });

    res.status(201).json({ success: true, message: "Cinema product created successfully.", product });
  } catch (error) {
    console.error("Create cinema product error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Duplicate field value." });
    }
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const updateCinemaProduct = async (req, res) => {
  try {
    const product = await Cinema.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Cinema product not found." });
    }

    const { name, model, category, description, badge, specs, status } = req.body;

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
      if (product.pdf?.url && product.pdf.url.startsWith('/uploads/pdfs/')) {
        deleteLocalPdf(product.pdf.url);
      } else if (product.pdf?.publicId) {
        await deleteFromCloudinary(product.pdf.publicId);
      }
      const pdfUrl = savePdfLocally(req.files.pdf[0].buffer, req.files.pdf[0].originalname);
      pdf = { url: pdfUrl, publicId: "" };
    }

    let parsedSpecs = product.specs;
    if (specs !== undefined) {
      try {
        parsedSpecs = typeof specs === "string" ? JSON.parse(specs) : specs;
      } catch (e) {
        console.error("Error parsing specs:", e);
      }
    }

    const updatedProduct = await Cinema.findByIdAndUpdate(
      req.params.id,
      {
        name: name || product.name,
        model: model !== undefined ? model : product.model,
        category: category || product.category,
        description: description || product.description,
        badge: badge !== undefined ? badge : product.badge,
        specs: parsedSpecs,
        image,
        pdf,
        status: status || product.status,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: "Cinema product updated successfully.", product: updatedProduct });
  } catch (error) {
    console.error("Update cinema product error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const deleteCinemaProduct = async (req, res) => {
  try {
    const product = await Cinema.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Cinema product not found." });
    }

    if (product.image?.publicId) {
      await deleteFromCloudinary(product.image.publicId);
    }
    
    if (product.pdf?.url && product.pdf.url.startsWith('/uploads/pdfs/')) {
      deleteLocalPdf(product.pdf.url);
    } else if (product.pdf?.publicId) {
      await deleteFromCloudinary(product.pdf.publicId);
    }

    await Cinema.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Cinema product deleted successfully." });
  } catch (error) {
    console.error("Delete cinema product error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  getPublicCinemaProducts,
  getAdminCinemaProducts,
  getAdminCinemaProductById,
  createCinemaProduct,
  updateCinemaProduct,
  deleteCinemaProduct,
};
