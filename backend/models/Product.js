const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    model: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: [80, "Category cannot exceed 80 characters"],
    },
    brand: {
      type: String,
      trim: true,
      default: "AudioTechServices",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    badge: {
      type: String,
      trim: true,
      default: "",
    },
    specs: {
      type: [String],
      default: [],
    },
    image: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",  // empty = hosted locally in /public
      },
    },
    pdf: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",  // empty = hosted locally in /public
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "Status must be active or inactive",
      },
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from name before saving
productSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Auto-generate slug before update
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.name || (update.$set && update.$set.name)) {
    const name = update.name || update.$set.name;
    const slug = slugify(name, { lower: true, strict: true });
    if (update.$set) {
      update.$set.slug = slug;
    } else {
      update.slug = slug;
    }
  }
  next();
});

// Indexes for fast queries
productSchema.index({ category: 1, status: 1 });
productSchema.index({ featured: 1 });

module.exports = mongoose.model("Product", productSchema);
