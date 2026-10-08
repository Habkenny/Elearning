const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const studentRoutes = require("./routes/studentRoutes");
const materialRoutes = require("./routes/materialRoutes");
const courseRoutes = require("./routes/courseRoutes");

app.use("/api/students", studentRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/courses", courseRoutes);

app.get("/", (req, res) => {
  res.send("E-Learning Backend is running!");
});

const PORT = 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });