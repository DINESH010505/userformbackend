// server.js
// This is the ENTRY POINT of the backend. Running "node server.js" starts everything.
// Its job: load config -> connect to MongoDB -> set up Express -> start listening.

require("dotenv").config(); // loads variables from .env into process.env

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ---------- Middleware ----------
app.use(cors()); // allows the React app (different port/origin) to call this API
app.use(express.json()); // parses incoming JSON request bodies into req.body

// ---------- Routes ----------
// Every route inside userRoutes.js will be prefixed with /api/users
app.use("/api/users", userRoutes);

// Simple health-check route, useful to confirm the server is alive
app.get("/", (req, res) => {
  res.status(200).json({ message: "User Details Management API is running" });
});

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ---------- Database connection + server start ----------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // stop the app if the database isn't reachable
  });
