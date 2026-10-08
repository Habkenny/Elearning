const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Material = require("../models/Material");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// POST /api/materials/upload (admin only)
router.post("/upload", requireAuth, requireAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file was uploaded" });
    }

    const material = new Material({
      title: req.body.title,
      course: req.body.course || "",
      code: req.body.code || "",
      topic: req.body.topic || "",
      category: req.body.category || "Other",
      description: req.body.description || "",
      storedFilename: req.file.filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user.id,
    });

    await material.save();
    res.status(201).json({ message: "Material uploaded successfully", material });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

// GET /api/materials (any logged-in user)
router.get("/", requireAuth, async (req, res) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });
    res.status(200).json({ materials });
  } catch (error) {
    res.status(500).json({ message: "Failed to load materials", error: error.message });
  }
});

// GET /api/materials/:id (single material — for the details page)
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.status(200).json({ material });
  } catch (error) {
    res.status(500).json({ message: "Failed to load material", error: error.message });
  }
});

// GET /api/materials/:id/download (logged-in user)
router.get("/:id/download", requireAuth, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    const filePath = path.join(UPLOAD_DIR, material.storedFilename);
    res.download(filePath, material.originalName);
  } catch (error) {
    res.status(500).json({ message: "Download failed", error: error.message });
  }
});

// DELETE /api/materials/:id (admin only)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    const filePath = path.join(UPLOAD_DIR, material.storedFilename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Material.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Material deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

module.exports = router;