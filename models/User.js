// models/User.js
// This file defines the "shape" of a User document that gets stored in MongoDB.
// Mongoose uses this schema to validate data BEFORE it is saved to the database.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true, // no two users can share the same email
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[0-9]{10}$/, "Phone number must be exactly 10 digits"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxlength: [250, "Address cannot exceed 250 characters"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxlength: [100, "City cannot exceed 100 characters"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      maxlength: [100, "State cannot exceed 100 characters"],
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      trim: true,
      match: [/^[0-9]{6}$/, "Pincode must be exactly 6 digits"],
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields to every document
    timestamps: true,
  }
);

// "User" -> Mongoose will create/use a MongoDB collection called "users"
module.exports = mongoose.model("User", userSchema);
