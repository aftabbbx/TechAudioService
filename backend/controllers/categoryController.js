const Category = require("../models/Category");
const Product = require("../models/Product");

const listPublicCategories = async (req, res) => {
  try {
    const [managedCategories, usedCategories] = await Promise.all([
      Category.find().select("name").sort({ name: 1 }),
      Product.distinct("category", { status: "active" }),
    ]);

    const categories = [...new Set([
      ...managedCategories.map((category) => category.name),
      ...usedCategories.filter(Boolean),
    ])].sort((a, b) => a.localeCompare(b));

    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("List public categories error:", error);
    res.status(500).json({ success: false, message: "Could not load categories." });
  }
};

const listAdminCategories = async (req, res) => {
  try {
    const [managedCategories, usage] = await Promise.all([
      Category.find().sort({ name: 1 }),
      Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
    ]);

    const managedByName = new Map(
      managedCategories.map((category) => [category.name, category])
    );
    const usageByName = new Map(usage.map(({ _id, count }) => [_id, count]));
    const names = new Set([
      ...managedCategories.map((category) => category.name),
      ...usage.map(({ _id }) => _id).filter(Boolean),
    ]);

    const categories = [...names]
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({
        id: managedByName.get(name)?._id || null,
        name,
        productCount: usageByName.get(name) || 0,
        managed: managedByName.has(name),
      }));

    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("List admin categories error:", error);
    res.status(500).json({ success: false, message: "Could not load categories." });
  }
};

const createCategory = async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required." });
    }
    if (name.length > 80) {
      return res.status(400).json({ success: false, message: "Category name cannot exceed 80 characters." });
    }

    const nameKey = name.toLocaleLowerCase("en");
    if (nameKey === "all") {
      return res.status(400).json({ success: false, message: "‘All’ is reserved for the product filter." });
    }
    const existing = await Category.findOne({ nameKey }).select("_id");
    if (existing) {
      return res.status(409).json({ success: false, message: "That category already exists." });
    }

    const category = await Category.create({ name, nameKey });
    res.status(201).json({
      success: true,
      category: { id: category._id, name: category.name, productCount: 0, managed: true },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "That category already exists." });
    }
    console.error("Create category error:", error);
    res.status(500).json({ success: false, message: "Could not create category." });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    const productCount = await Product.countDocuments({ category: category.name });
    if (productCount > 0) {
      return res.status(409).json({
        success: false,
        message: `Move or delete the ${productCount} product${productCount === 1 ? "" : "s"} in this category first.`,
      });
    }

    await category.deleteOne();
    res.status(200).json({ success: true, message: "Category deleted." });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ success: false, message: "Could not delete category." });
  }
};

module.exports = { listPublicCategories, listAdminCategories, createCategory, deleteCategory };
