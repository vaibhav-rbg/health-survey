const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

/* -------------------- UPLOADS FOLDER -------------------- */
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* -------------------- MULTER STORAGE -------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `photo_${timestamp}.png`);
  }
});
const upload = multer({ storage });

/* -------------------- STATIC FRONTEND -------------------- */
app.use(express.static(path.join(__dirname, "public")));

/* -------------------- STATIC UPLOADS -------------------- */
app.use("/uploads", express.static(uploadDir));

/* -------------------- UPLOAD ENDPOINT -------------------- */
app.post("/api/upload", upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ status: "failed" });

  console.log("Photo received:", req.file.filename);

  // Send download URL back to browser
  res.json({
    status: "success",
    downloadUrl: `/uploads/${req.file.filename}`
  });
});

/* -------------------- PORT -------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

