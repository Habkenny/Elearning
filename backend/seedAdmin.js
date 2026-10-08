const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Student = require("./models/Student");

// ⚠️ CHANGE THESE THREE LINES to your own admin details
const ADMIN_NAME = "Site Admin";
const ADMIN_EMAIL = "admin@elearn.com";
const ADMIN_PASSWORD = "AdminPass123";

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await Student.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      const salt = await bcrypt.genSalt(10);
      existing.password = await bcrypt.hash(ADMIN_PASSWORD, salt);
      existing.isAdmin = true;
      await existing.save();
      console.log(`Updated existing user to admin: ${ADMIN_EMAIL}`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

      await Student.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        isAdmin: true,
      });

      console.log(`Admin account created: ${ADMIN_EMAIL}`);
    }

    await mongoose.disconnect();
    console.log("Done. You can now log in as admin.");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

seedAdmin();