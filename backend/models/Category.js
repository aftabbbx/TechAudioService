const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [80, "Category name cannot exceed 80 characters"],
    },
    nameKey: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
