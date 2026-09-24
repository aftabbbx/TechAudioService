const mongoose = require("mongoose");
const slugify = require("slugify");

const cinemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Cinema product name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
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
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: {
        values: [
          "Amplifiers",
          "Digital Speakers",
          "Subwoofers",
          "Speaker Management",
          "Surround Speakers",
        ],
        message: "Please select a valid category",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    badge: {
      type: String,
      trim: true,
      default: "",
    },
    specs: [
      {
        label: { type: String, trim: true },
        value: { type: String, trim: true },
      },
    ],
    image: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    pdf: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
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
cinemaSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

cinemaSchema.pre("findOneAndUpdate", function (next) {
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

cinemaSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model("Cinema", cinemaSchema);
