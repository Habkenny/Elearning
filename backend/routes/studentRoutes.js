const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// POST /api/students/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = new Student({
      name,
      email,
      password: hashedPassword,
    });

    await student.save();

    res.status(201).json({
      message: "Registration successful",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

// POST /api/students/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter your email and password" });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, student.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: student._id, isAdmin: student.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        isAdmin: student.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// ===== SELF-SERVICE (any logged-in student) =====

// PUT /api/students/profile — logged-in user updates THEIR OWN profile
// ⚠️ Must come BEFORE /:id, otherwise "profile" gets treated as an ID
router.put("/profile", requireAuth, async (req, res) => {
  try {
    const { name, email, phone, course, matricNumber, programme, level } = req.body;

    // If changing email, make sure nobody else has it
    if (email) {
      const taken = await Student.findOne({
        email,
        _id: { $ne: req.user.id },
      });

      if (taken) {
        return res.status(400).json({ message: "That email is already in use" });
      }
    }

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, course, matricNumber, programme, level },
      { new: true, runValidators: true },
    ).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Profile updated", student });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});

// ===== ADMIN ENDPOINTS (requireAuth + requireAdmin) =====

// GET /api/students — admin: list all registered students
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password") // NEVER send password hashes to the frontend
      .sort({ createdAt: -1 });

    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: "Failed to load students", error: error.message });
  }
});

// PUT /api/students/:id — admin: edit a student's info
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, email, phone, course, status } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, course, status },
      { new: true, runValidators: true },
    ).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student updated", student });
  } catch (error) {
    res.status(500).json({ message: "Failed to update student", error: error.message });
  }
});

// DELETE /api/students/:id — admin: remove a student account
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    // Safety: don't let the admin delete their own account
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student", error: error.message });
  }
});

module.exports = router;