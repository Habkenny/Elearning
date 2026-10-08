const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    course: { type: String, default: "" },
    code: { type: String, default: "" },
    topic: { type: String, default: "" },
    category: { type: String, default: "Other" },
    description: { type: String, default: "" },

    storedFilename: { type: String, required: true },
    originalName: { type: String, required: true },
    fileType: String,
    fileSize: Number,

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Material", materialSchema);