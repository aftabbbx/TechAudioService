const multer = require("multer");

// Memory storage — buffers uploaded directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const allowedPdfTypes = ["application/pdf"];

  if (file.fieldname === "image" && allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === "pdf" && allowedPdfTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    if (file.fieldname === "image") {
      cb(new Error("Invalid image type. Only JPEG, PNG, and WebP are allowed."), false);
    } else {
      cb(new Error("Invalid file type. Only PDF files are allowed for the pdf field."), false);
    }
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit (PDFs can be larger)
  },
});

// Accept both image and pdf fields
const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
]);

module.exports = { upload, uploadFields };
