const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Course = require("../models/Course");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Upload storage (same setup as materials)
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// GET /api/courses — any logged-in user
router.get("/", requireAuth, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: "Failed to load courses", error: error.message });
  }
});

// POST /api/courses — admin only, WITH file upload
router.post("/", requireAuth, requireAdmin, upload.single("file"), async (req, res) => {
  try {
    const { code, title, category, instructor, duration } = req.body;

    if (!code || !title) {
      return res.status(400).json({ message: "Course code and title are required" });
    }

    const existing = await Course.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "A course with this code already exists" });
    }

    const course = await Course.create({
      code,
      title,
      category: category || "",
      instructor: instructor || "",
      duration: duration || "",

      // File fields (empty if no file was attached)
      storedFilename: req.file ? req.file.filename : "",
      originalName: req.file ? req.file.originalname : "",
      fileType: req.file ? req.file.mimetype : "",
      fileSize: req.file ? req.file.size : 0,
    });

    res.status(201).json({ message: "Course uploaded successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload course", error: error.message });
  }
});

// GET /api/courses/:id/download — logged-in user, saves file to device
router.get("/:id/download", requireAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course || !course.storedFilename) {
      return res.status(404).json({ message: "Course file not found" });
    }

    const filePath = path.join(UPLOAD_DIR, course.storedFilename);
    res.download(filePath, course.originalName);
  } catch (error) {
    res.status(500).json({ message: "Download failed", error: error.message });
  }
});

// PUT /api/courses/:id — admin only (edit; optional new file replaces old)
router.put("/:id", requireAuth, requireAdmin, upload.single("file"), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.code = req.body.code ?? course.code;
    course.title = req.body.title ?? course.title;
    course.category = req.body.category ?? course.category;
    course.instructor = req.body.instructor ?? course.instructor;
    course.duration = req.body.duration ?? course.duration;

    // Only replace the file if a new one was attached
    if (req.file) {
      // Delete the old file from disk
      const oldPath = path.join(UPLOAD_DIR, course.storedFilename);
      if (course.storedFilename && fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      course.storedFilename = req.file.filename;
      course.originalName = req.file.originalname;
      course.fileType = req.file.mimetype;
      course.fileSize = req.file.size;
    }

    await course.save();

    res.status(200).json({ message: "Course updated", course });
  } catch (error) {
    res.status(500).json({ message: "Failed to update course", error: error.message });
  }
});

// DELETE /api/courses/:id — admin only
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Remove the file from disk too
    if (course.storedFilename) {
      const filePath = path.join(UPLOAD_DIR, course.storedFilename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course", error: error.message });
  }
});

module.exports = router;