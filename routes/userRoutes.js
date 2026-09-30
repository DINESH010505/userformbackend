// routes/userRoutes.js
// This file defines all the API endpoints ("routes") related to Users.
// Each route receives an HTTP request, talks to MongoDB via the User model,
// and sends back a JSON response.

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");

// Small helper: checks if a given string is a valid MongoDB ObjectId.
// This prevents the app from crashing when someone passes a badly formatted id.
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * @route   GET /api/users
 * @desc    Get all users, newest first
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching users", error: error.message });
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user by their MongoDB _id
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching user", error: error.message });
  }
});

/**
 * @route   POST /api/users
 * @desc    Create a new user
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address, city, state, pincode } = req.body;

    // Basic presence check (Mongoose schema validation also runs below)
    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = new User({ name, email, phone, address, city, state, pincode });
    const savedUser = await newUser.save(); // triggers schema validation

    res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    // Duplicate email error from MongoDB (unique index)
    if (error.code === 11000) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }
    // Mongoose validation error (bad email format, wrong phone length, etc.)
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error while creating user", error: error.message });
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update an existing user
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const { name, email, phone, address, city, state, pincode } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, phone, address, city, state, pincode },
      {
        new: true, // return the UPDATED document instead of the old one
        runValidators: true, // re-run schema validation on update
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error while updating user", error: error.message });
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting user", error: error.message });
  }
});

module.exports = router;
