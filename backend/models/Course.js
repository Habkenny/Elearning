const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "",
    },

    instructor: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },

    // The uploaded course file (PDF, etc.) — Django's FileField
    storedFilename: {
      type: String,
      default: "",
    },

    originalName: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      default: "",
    },

    fileSize: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Course", courseSchema);