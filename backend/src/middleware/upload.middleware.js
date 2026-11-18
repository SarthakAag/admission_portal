
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadDirectory = path.resolve(
  process.cwd(),
  "uploads",
  "documents"
);

// Ensure upload directory exists
fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedTypes = {
  ".pdf": ["application/pdf"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png": ["image/png"],
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const validMimeTypes = allowedTypes[extension];

  if (!validMimeTypes || !validMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only PDF, JPG, JPEG, and PNG files are allowed."));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },
});

module.exports = upload;
