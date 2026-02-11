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

/* -------------------- UPLOAD ENDPOINT -------------------- */
app.post("/api/upload", upload.single("photo"), (req, res) => {
  if (!req.file) return res.status(400).json({ status: "failed" });

  console.log("Photo received:", req.file.filename); // logs in Render

  res.json({ status: "success" });
});

/* -------------------- ADMIN PAGE -------------------- */
app.get("/admin", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.send("Error reading uploads");

    let html = `
      <html>
      <head>
      <title>Admin - Received Photos</title>
      <style>
        body { font-family: Arial; background: #f0f0f0; text-align:center; }
        h2 { color: #333; }
        img { width: 150px; margin: 10px; border-radius: 12px; border: 2px solid #4CAF50; transition: transform 0.3s; }
        img:hover { transform: scale(1.1); }
      </style>
      </head>
      <body>
      <h2>Received Photos</h2>
      ${files.map(f => `<img src="/uploads/${f}" />`).join("")}
      </body>
      </html>
    `;
    res.send(html);
  });
});

/* -------------------- PORT -------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

